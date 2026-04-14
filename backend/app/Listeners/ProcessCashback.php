<?php

namespace App\Listeners;

use App\Events\BadgeUnlocked;
use Illuminate\Support\Facades\Log;

class ProcessCashback
{
    public function handle(BadgeUnlocked $event): void
    {
        $user  = $event->user;
        $badge = $event->badgeName;

        // Mock payment provider — in production this would call a real payments API
        Log::info('[CashbackProvider] Payment initiated', [
            'user_id'    => $user->id,
            'user_email' => $user->email,
            'badge'      => $badge,
            'amount'     => 300,
            'currency'   => 'NGN',
            'status'     => 'success',
        ]);
    }
}
