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
        // Unlocked achievements with their unlock timestamps
        $unlockedRows = $user->achievements()
            ->orderBy('required_purchases')
            ->get(['achievements.id', 'achievements.name', 'user_achievements.unlocked_at']);

        $unlockedAchievements = $unlockedRows->map(fn ($a) => [
            'name'        => $a->name,
            'unlocked_at' => $a->pivot->unlocked_at,
        ])->values()->toArray();

        $unlockedIds = $unlockedRows->pluck('id');

        $nextAvailable = Achievement::whereNotIn('id', $unlockedIds)
            ->orderBy('required_purchases')
            ->limit(1)
            ->pluck('name')
            ->toArray();

        $achievementCount = count($unlockedAchievements);

        // Current badge = highest unlocked (latest unlocked_at wins)
        $currentBadge = $user->badges()
            ->orderByPivot('unlocked_at', 'desc')
            ->first();

        if (! $currentBadge) {
            $currentBadge = Badge::where('min_achievements', 0)->first();
        }

        // Next badge = the lowest badge whose threshold is still above the user's count
        $nextBadge = Badge::where('min_achievements', '>', $achievementCount)
            ->orderBy('min_achievements')
            ->first();

        $remainingToUnlockNextBadge = $nextBadge
            ? max(0, $nextBadge->min_achievements - $achievementCount)
            : 0;

        return response()->json([
            'purchase_count'                 => $user->purchases()->count(),
            'unlocked_achievements'          => $unlockedAchievements,
            'next_available_achievements'    => $nextAvailable,
            'current_badge'                  => $currentBadge?->name ?? 'Beginner',
            'next_badge'                     => $nextBadge?->name,
            'remaining_to_unlock_next_badge' => $remainingToUnlockNextBadge,
        ]);
    }
}
