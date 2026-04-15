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
        $user  = $event->purchase->user;
        $count = $user->purchases()->count();

        // Writes are atomic: if two purchases arrive simultaneously, only one
        // transaction will win the lock and insert. Events fire after commit
        // so a rollback never leaves orphaned dispatches.
        $newlyUnlocked = DB::transaction(function () use ($user, $count) {
            $unlockedIds = $user->achievements()->pluck('achievements.id');

            $achievements = Achievement::whereNotIn('id', $unlockedIds)
                ->where('required_purchases', '<=', $count)
                ->orderBy('required_purchases')
                ->get();

            foreach ($achievements as $achievement) {
                $user->achievements()->attach($achievement->id, ['unlocked_at' => now()]);
            }

            return $achievements;
        });

        foreach ($newlyUnlocked as $achievement) {
            AchievementUnlocked::dispatch($achievement->name, $user);
        }
    }
}
