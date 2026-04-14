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

        $achievementCount = $user->achievements()->count();

        $unlockedBadgeIds = $user->badges()->pluck('badges.id');

        $newlyUnlocked = Badge::whereNotIn('id', $unlockedBadgeIds)
            ->where('min_achievements', '<=', $achievementCount)
            ->orderBy('min_achievements')
            ->get();

        foreach ($newlyUnlocked as $badge) {
            DB::table('user_badges')->insert([
                'user_id'     => $user->id,
                'badge_id'    => $badge->id,
                'unlocked_at' => now(),
            ]);

            BadgeUnlocked::dispatch($badge->name, $user);
        }
    }
}
