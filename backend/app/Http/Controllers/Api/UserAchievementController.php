<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use App\Models\Badge;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class UserAchievementController extends Controller
{
    public function show(User $user): JsonResponse
    {
        $unlockedAchievements = $user->achievements()
            ->orderBy('required_purchases')
            ->pluck('name')
            ->toArray();

        $unlockedIds = $user->achievements()->pluck('achievements.id');

        $nextAvailable = Achievement::whereNotIn('id', $unlockedIds)
            ->orderBy('required_purchases')
            ->limit(1)
            ->pluck('name')
            ->toArray();

        $achievementCount = count($unlockedAchievements);

        $currentBadge = $user->badges()
            ->orderByPivot('unlocked_at', 'desc')
            ->first();

        // Fall back to 'Beginner' (min_achievements = 0) if no badge earned yet
        if (! $currentBadge) {
            $currentBadge = Badge::where('min_achievements', 0)->first();
        }

        $nextBadge = Badge::where('min_achievements', '>', $achievementCount)
            ->orderBy('min_achievements')
            ->first();

        // If the user hasn't earned even the first badge yet, next badge
        // is the lowest one above Beginner that they still need
        if (! $nextBadge && $currentBadge) {
            $nextBadge = Badge::where('min_achievements', '>', $currentBadge->min_achievements)
                ->orderBy('min_achievements')
                ->first();
        }

        $remainingToUnlockNextBadge = $nextBadge
            ? max(0, $nextBadge->min_achievements - $achievementCount)
            : 0;

        return response()->json([
            'unlocked_achievements'          => $unlockedAchievements,
            'next_available_achievements'    => $nextAvailable,
            'current_badge'                  => $currentBadge?->name ?? 'Beginner',
            'next_badge'                     => $nextBadge?->name,
            'remaining_to_unlock_next_badge' => $remainingToUnlockNextBadge,
        ]);
    }
}
