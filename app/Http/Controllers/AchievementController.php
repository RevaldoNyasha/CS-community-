<?php

namespace App\Http\Controllers;

use App\Http\Requests\AchievementRequest;
use App\Models\Achievement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AchievementController extends Controller
{
    public function index(Request $request): Response
    {
        $achievements = Achievement::query()
            ->with(['user:id,name'])
            ->withCount('achievementRatings')
            ->when($request->input('search'), fn ($q, $search) => $q->where('title', 'like', "%{$search}%"))
            ->orderByDesc('achieved_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('achievements/index', [
            'achievements' => $achievements,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('achievements/create');
    }

    public function store(AchievementRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['slug'] = Str::slug($validated['title']).'-'.Str::random(5);

        $request->user()->achievements()->create($validated);

        return redirect()->route('achievements.index')->with('success', 'Achievement added.');
    }

    public function show(Achievement $achievement): Response
    {
        $achievement->load(['user:id,name', 'achievementRatings.user:id,name']);

        return Inertia::render('achievements/show', [
            'achievement' => $achievement,
            'averageRating' => $achievement->averageRating(),
        ]);
    }

    public function edit(Achievement $achievement): Response
    {
        abort_unless(auth()->id() === $achievement->user_id || auth()->user()->isAdmin(), 403);

        return Inertia::render('achievements/edit', [
            'achievement' => $achievement,
        ]);
    }

    public function update(AchievementRequest $request, Achievement $achievement): RedirectResponse
    {
        abort_unless(auth()->id() === $achievement->user_id || auth()->user()->isAdmin(), 403);

        $achievement->update($request->validated());

        return redirect()->route('achievements.show', $achievement)->with('success', 'Achievement updated.');
    }

    public function destroy(Achievement $achievement): RedirectResponse
    {
        abort_unless(auth()->id() === $achievement->user_id || auth()->user()->isAdmin(), 403);

        $achievement->delete();

        return redirect()->route('achievements.index')->with('success', 'Achievement deleted.');
    }
}
