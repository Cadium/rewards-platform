<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::withCount('purchases')->orderBy('id')->get()
            ->map(fn (User $user) => [
                'id'             => $user->id,
                'name'           => $user->name,
                'purchase_count' => $user->purchases_count,
            ]);

        return response()->json($users);
    }
}
