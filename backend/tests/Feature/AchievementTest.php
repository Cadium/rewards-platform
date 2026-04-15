<?php

namespace Tests\Feature;

use App\Events\AchievementUnlocked;
use App\Events\BadgeUnlocked;
use App\Events\PurchaseMade;
use App\Models\Achievement;
use App\Models\Badge;
use App\Models\Purchase;
use App\Models\User;
use Database\Seeders\AchievementSeeder;
use Database\Seeders\BadgeSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class AchievementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(AchievementSeeder::class);
        $this->seed(BadgeSeeder::class);
    }

    public function test_api_returns_correct_structure_for_new_user(): void
    {
        $user = User::factory()->create();

        $response = $this->getJson("/api/users/{$user->id}/achievements");

        $response->assertOk()
            ->assertJsonStructure([
                'unlocked_achievements',
                'next_available_achievements',
                'current_badge',
                'next_badge',
                'remaining_to_unlock_next_badge',
            ]);
    }

    public function test_first_purchase_unlocks_first_purchase_achievement(): void
    {
        $user     = User::factory()->create();
        $purchase = Purchase::create(['user_id' => $user->id, 'amount' => 500]);

        PurchaseMade::dispatch($purchase);

        $this->assertDatabaseHas('user_achievements', [
            'user_id' => $user->id,
        ]);

        $this->assertTrue(
            $user->achievements()->where('name', 'First Purchase')->exists()
        );
    }

    public function test_achievement_unlocked_event_is_fired(): void
    {
        Event::fake([AchievementUnlocked::class]);

        $user     = User::factory()->create();
        $purchase = Purchase::create(['user_id' => $user->id, 'amount' => 500]);

        PurchaseMade::dispatch($purchase);

        Event::assertDispatched(AchievementUnlocked::class, function ($event) {
            return $event->achievementName === 'First Purchase';
        });
    }

    public function test_badge_unlocked_event_is_fired_when_threshold_is_reached(): void
    {
        Event::fake([BadgeUnlocked::class]);

        $user = User::factory()->create();

        // Unlock 4 achievements to trigger Bronze badge
        foreach ([1, 5, 10, 25] as $i => $count) {
            for ($j = 0; $j < $count - ($i > 0 ? [1, 5, 10][($i - 1)] : 0); $j++) {
                Purchase::create(['user_id' => $user->id, 'amount' => 100]);
            }
        }

        // Manually give user 4 achievements to trigger Bronze
        $achievements = Achievement::orderBy('required_purchases')->take(4)->get();
        foreach ($achievements as $achievement) {
            \Illuminate\Support\Facades\DB::table('user_achievements')->insertOrIgnore([
                'user_id'        => $user->id,
                'achievement_id' => $achievement->id,
                'unlocked_at'    => now(),
            ]);
        }

        AchievementUnlocked::dispatch('25 Purchases', $user);

        Event::assertDispatched(BadgeUnlocked::class, function ($event) {
            return $event->badgeName === 'Bronze';
        });
    }

    public function test_api_returns_unlocked_achievements_after_purchases(): void
    {
        $user = User::factory()->create();

        // Simulate 5 purchases
        for ($i = 0; $i < 5; $i++) {
            $purchase = Purchase::create(['user_id' => $user->id, 'amount' => 200]);
            PurchaseMade::dispatch($purchase);
        }

        $response = $this->getJson("/api/users/{$user->id}/achievements");

        $response->assertOk();

        $data = $response->json();

        $names = array_column($data['unlocked_achievements'], 'name');
        $this->assertContains('First Purchase', $names);
        $this->assertContains('5 Purchases', $names);
        $this->assertNotEmpty($data['next_available_achievements']);
    }

    public function test_remaining_to_unlock_next_badge_is_accurate(): void
    {
        $user = User::factory()->create();

        // Give the user 2 achievements manually
        $achievements = Achievement::orderBy('required_purchases')->take(2)->get();
        foreach ($achievements as $achievement) {
            \Illuminate\Support\Facades\DB::table('user_achievements')->insert([
                'user_id'        => $user->id,
                'achievement_id' => $achievement->id,
                'unlocked_at'    => now(),
            ]);
        }

        $response = $this->getJson("/api/users/{$user->id}/achievements");

        $data = $response->json();

        // Bronze requires 4 achievements; user has 2, so remaining = 2
        $this->assertEquals(2, $data['remaining_to_unlock_next_badge']);
        $this->assertEquals('Bronze', $data['next_badge']);
    }

    public function test_cashback_is_logged_when_badge_is_unlocked(): void
    {
        $user  = User::factory()->create();
        $event = new BadgeUnlocked('Bronze', $user);

        \Illuminate\Support\Facades\Log::shouldReceive('info')
            ->once()
            ->withArgs(function ($message, $context) use ($user) {
                return str_contains($message, 'CashbackProvider')
                    && $context['user_id'] === $user->id
                    && $context['amount'] === 300;
            });

        (new \App\Listeners\ProcessCashback())->handle($event);
    }
}
