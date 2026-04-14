<?php

namespace App\Providers;

use App\Events\AchievementUnlocked;
use App\Events\BadgeUnlocked;
use App\Events\PurchaseMade;
use App\Listeners\ProcessCashback;
use App\Listeners\ProcessNewAchievements;
use App\Listeners\ProcessNewBadge;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Event::listen(PurchaseMade::class, ProcessNewAchievements::class);
        Event::listen(AchievementUnlocked::class, ProcessNewBadge::class);
        Event::listen(BadgeUnlocked::class, ProcessCashback::class);
    }
}
