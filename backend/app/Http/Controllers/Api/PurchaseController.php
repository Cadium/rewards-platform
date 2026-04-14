<?php

namespace App\Http\Controllers\Api;

use App\Events\PurchaseMade;
use App\Http\Controllers\Controller;
use App\Models\Purchase;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PurchaseController extends Controller
{
    public function store(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01'],
        ]);

        $purchase = Purchase::create([
            'user_id' => $user->id,
            'amount'  => $validated['amount'],
        ]);

        PurchaseMade::dispatch($purchase);

        return response()->json([
            'message'           => 'Purchase recorded successfully.',
            'purchase_id'       => $purchase->id,
            'total_purchases'   => $user->purchases()->count(),
        ], 201);
    }
}
