<?php

use App\Http\Controllers\Admin\AdminAnnouncementController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminPendingController;
use App\Http\Controllers\Admin\AdminPostController;
use App\Http\Controllers\Admin\AdminSettingsController;
use App\Http\Controllers\Admin\AdminSuggestionController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\SuggestionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// User routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::get('resources', [PostController::class, 'index'])
        ->name('resources.index')
        ->defaults('type', 'resource');

    Route::get('hackathons', [PostController::class, 'index'])
        ->name('hackathons.index')
        ->defaults('type', 'hackathon');

    Route::get('posts/create', [PostController::class, 'create'])->name('posts.create');
    Route::post('posts', [PostController::class, 'store'])->name('posts.store');
    Route::get('posts/{post}', [PostController::class, 'show'])->name('posts.show');
    Route::get('posts/{post}/download', [PostController::class, 'download'])->name('posts.download');

    Route::post('posts/{post}/like', [LikeController::class, 'toggle'])->name('posts.like');

    Route::post('posts/{post}/comments', [CommentController::class, 'store'])->name('comments.store');
    Route::delete('comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');

    Route::get('suggestions', [SuggestionController::class, 'index'])->name('suggestions.index');
    Route::post('suggestions', [SuggestionController::class, 'store'])->name('suggestions.store');
});

// Admin routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', AdminDashboardController::class)->name('dashboard');

    Route::get('users', [AdminUserController::class, 'index'])->name('users.index');
    Route::delete('users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
    Route::post('users/{user}/promote', [AdminUserController::class, 'promote'])->name('users.promote');
    Route::post('users/{user}/demote', [AdminUserController::class, 'demote'])->name('users.demote');

    Route::get('posts', [AdminPostController::class, 'index'])->name('posts.index');
    Route::post('posts/{post}/approve', [AdminPostController::class, 'approve'])->name('posts.approve');
    Route::delete('posts/{post}', [AdminPostController::class, 'destroy'])->name('posts.destroy');

    Route::get('pending', [AdminPendingController::class, 'index'])->name('pending.index');

    Route::get('suggestions', [AdminSuggestionController::class, 'index'])->name('suggestions.index');

    Route::get('announcements', [AdminAnnouncementController::class, 'index'])->name('announcements.index');
    Route::post('announcements', [AdminAnnouncementController::class, 'store'])->name('announcements.store');
    Route::delete('announcements/{post}', [AdminAnnouncementController::class, 'destroy'])->name('announcements.destroy');

    Route::get('settings', AdminSettingsController::class)->name('settings');
});

require __DIR__.'/settings.php';
