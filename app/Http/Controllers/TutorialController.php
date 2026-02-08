<?php

namespace App\Http\Controllers;

use App\Http\Requests\TutorialRequest;
use App\Models\Tutorial;
use App\Models\TutorialCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TutorialController extends Controller
{
    public function index(Request $request): Response
    {
        $tutorials = Tutorial::query()
            ->with(['user:id,name', 'tutorialCategory:id,name'])
            ->when($request->input('category_id'), fn ($q, $catId) => $q->where('tutorial_category_id', $catId))
            ->when($request->input('search'), fn ($q, $search) => $q->where('title', 'like', "%{$search}%"))
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('tutorials/index', [
            'tutorials' => $tutorials,
            'categories' => TutorialCategory::query()->orderBy('sort_order')->get(),
            'filters' => $request->only(['category_id', 'search']),
        ]);
    }

    public function create(): Response
    {
        $this->authorizeAdmin();

        return Inertia::render('tutorials/create', [
            'categories' => TutorialCategory::query()->orderBy('sort_order')->get(),
        ]);
    }

    public function store(TutorialRequest $request): RedirectResponse
    {
        $this->authorizeAdmin();

        $request->user()->tutorials()->create($request->validated());

        return redirect()->route('tutorials.index')->with('success', 'Tutorial created.');
    }

    public function edit(Tutorial $tutorial): Response
    {
        $this->authorizeAdmin();

        return Inertia::render('tutorials/edit', [
            'tutorial' => $tutorial,
            'categories' => TutorialCategory::query()->orderBy('sort_order')->get(),
        ]);
    }

    public function update(TutorialRequest $request, Tutorial $tutorial): RedirectResponse
    {
        $this->authorizeAdmin();

        $tutorial->update($request->validated());

        return redirect()->route('tutorials.index')->with('success', 'Tutorial updated.');
    }

    public function destroy(Tutorial $tutorial): RedirectResponse
    {
        $this->authorizeAdmin();

        $tutorial->delete();

        return redirect()->route('tutorials.index')->with('success', 'Tutorial deleted.');
    }

    private function authorizeAdmin(): void
    {
        abort_unless(auth()->user()->isAdmin(), 403);
    }
}
