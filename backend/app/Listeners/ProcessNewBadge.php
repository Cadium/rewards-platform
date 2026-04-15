<?php

namespace App\Listeners;

use App\Events\AchievementUnlocked;
use App\Events\BadgeUnlocked;
use App\Models\Badge;
use Illuminate\Support\Facades\DB;

class ProcessNewBadge
{
    public function handle(AchievementUnlocked $event): void
    {
        $user = $event->user;

        $newlyUnlocked = DB::transaction(function () use ($user) {
            $achievementCount = $user->achievements()->count();
            $unlockedBadgeIds = $user->badges()->pluck('badges.id');

            $badges = Badge::whereNotIn('id', $unlockedBadgeIds)
                ->where('min_achievements', '<=', $achievementCount)
                ->orderBy('min_achievements')
                ->get();

            foreach ($badges as $badge) {
                $user->badges()->attach($badge->id, ['unlocked_at' => now()]);
            }

            return $badges;
        });

        foreach ($newlyUnlocked as $badge) {
            BadgeUnlocked::dispatch($badge->name, $user);
        }
    }
}
