<?php

use App\Http\Controllers\AchievementController;
use App\Http\Controllers\AchievementRatingController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\CareerResourceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ForumCommentController;
use App\Http\Controllers\ForumPostController;
use App\Http\Controllers\StudyResourceController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\TutorialController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::resource('announcements', AnnouncementController::class)->except(['show']);

    Route::resource('study-resources', StudyResourceController::class);

    Route::resource('tutorials', TutorialController::class);

    Route::resource('forum', ForumPostController::class)->parameters(['forum' => 'forumPost']);
    Route::post('forum/{forumPost}/comments', [ForumCommentController::class, 'store'])->name('forum.comments.store');
    Route::put('forum/comments/{forumComment}', [ForumCommentController::class, 'update'])->name('forum.comments.update');
    Route::delete('forum/comments/{forumComment}', [ForumCommentController::class, 'destroy'])->name('forum.comments.destroy');

    Route::resource('career-guidance', CareerResourceController::class)->parameters(['career-guidance' => 'careerResource']);

    Route::resource('achievements', AchievementController::class);
    Route::post('achievements/{achievement}/rate', [AchievementRatingController::class, 'store'])->name('achievements.rate');

    Route::resource('testimonials', TestimonialController::class)->only(['store', 'destroy']);
});

require __DIR__.'/settings.php';
