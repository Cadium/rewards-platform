<?php

namespace Database\Seeders;

use App\Models\Achievement;
use App\Models\Badge;
use App\Models\Purchase;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AchievementSeeder::class,
            BadgeSeeder::class,
        ]);

        $users = [
            ['name' => 'Emeka Obi',    'email' => 'emeka@example.com',  'purchases' => 0],
            ['name' => 'Amara Nwosu',  'email' => 'amara@example.com',  'purchases' => 5],
            ['name' => 'Dele Adeyemi', 'email' => 'dele@example.com',   'purchases' => 25],
            ['name' => 'Kemi Bakare',  'email' => 'kemi@example.com',   'purchases' => 100],
            ['name' => 'Tunde Okafor', 'email' => 'tunde@example.com',  'purchases' => 500],
        ];

        foreach ($users as $userData) {
            $purchaseCount = $userData['purchases'];
            unset($userData['purchases']);

            $user = User::factory()->create($userData);

            if ($purchaseCount > 0) {
                $rows = array_fill(0, $purchaseCount, [
                    'user_id'    => $user->id,
                    'amount'     => 500.00,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                Purchase::insert($rows);
            }

            $this->giveAchievementsAndBadges($user, $purchaseCount);
        }
    }

    private function giveAchievementsAndBadges(User $user, int $purchaseCount): void
    {
        $achievements = Achievement::where('required_purchases', '<=', $purchaseCount)
            ->orderBy('required_purchases')
            ->get();

        foreach ($achievements as $achievement) {
            DB::table('user_achievements')->insert([
                'user_id'        => $user->id,
                'achievement_id' => $achievement->id,
                'unlocked_at'    => now(),
            ]);
        }

        $achievementCount = $achievements->count();

        $badges = Badge::where('min_achievements', '<=', $achievementCount)
            ->orderBy('min_achievements')
            ->get();

        foreach ($badges as $badge) {
            DB::table('user_badges')->insert([
                'user_id'     => $user->id,
                'badge_id'    => $badge->id,
                'unlocked_at' => now(),
            ]);
        }
    }
}
