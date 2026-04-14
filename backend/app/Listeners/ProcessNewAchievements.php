<?php

namespace App\Listeners;

use App\Events\AchievementUnlocked;
use App\Events\PurchaseMade;
use App\Models\Achievement;
use Illuminate\Support\Facades\DB;

class ProcessNewAchievements
{
    public function handle(PurchaseMade $event): void
    {
        $user = $event->purchase->user;

        $purchaseCount = $user->purchases()->count();

        $unlockedIds = $user->achievements()->pluck('achievements.id');

        $newlyUnlocked = Achievement::whereNotIn('id', $unlockedIds)
            ->where('required_purchases', '<=', $purchaseCount)
            ->orderBy('required_purchases')
            ->get();

        foreach ($newlyUnlocked as $achievement) {
            DB::table('user_achievements')->insert([
                'user_id'        => $user->id,
                'achievement_id' => $achievement->id,
                'unlocked_at'    => now(),
            ]);

            AchievementUnlocked::dispatch($achievement->name, $user);
        }
    }
}
