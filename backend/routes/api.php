<?php

use App\Http\Controllers\Api\PurchaseController;
use App\Http\Controllers\Api\UserAchievementController;
use Illuminate\Support\Facades\Route;

Route::get('/users/{user}/achievements', [UserAchievementController::class, 'show']);
Route::post('/users/{user}/purchases', [PurchaseController::class, 'store']);
