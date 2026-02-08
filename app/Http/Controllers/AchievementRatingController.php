<?php

namespace App\Http\Controllers;

use App\Http\Requests\AchievementRatingRequest;
use App\Models\Achievement;
use App\Models\AchievementRating;
use Illuminate\Http\RedirectResponse;

class AchievementRatingController extends Controller
{
    public function store(AchievementRatingRequest $request, Achievement $achievement): RedirectResponse
    {
        AchievementRating::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'achievement_id' => $achievement->id,
            ],
            $request->validated()
        );

        return back()->with('success', 'Rating submitted.');
    }
}
