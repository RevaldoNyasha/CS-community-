<?php

namespace App\Http\Controllers;

use App\Http\Requests\Suggestion\StoreSuggestionRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SuggestionController extends Controller
{
    public function index(Request $request): Response
    {
        $suggestions = $request->user()
            ->suggestions()
            ->latest()
            ->paginate(15);

        return Inertia::render('suggestions/index', [
            'suggestions' => $suggestions,
        ]);
    }

    public function store(StoreSuggestionRequest $request): RedirectResponse
    {
        $request->user()->suggestions()->create($request->validated());

        return back()->with('success', 'Suggestion submitted. Thank you!');
    }
}
