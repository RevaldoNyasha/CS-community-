<?php

use App\Http\Controllers\Api\AutomationFeedController;
use Illuminate\Support\Facades\Route;

// Content automation ingestion (called by the GitHub Actions pipeline).
// Protected by a static Bearer token (`automation` middleware) and rate limited.
Route::middleware(['automation', 'throttle:60,1'])
    ->prefix('automation')
    ->group(function () {
        Route::post('posts', [AutomationFeedController::class, 'store'])->name('api.automation.posts.store');
    });
