<?php

namespace App\Http\Controllers;

use App\Http\Requests\CareerResourceRequest;
use App\Models\CareerResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CareerResourceController extends Controller
{
    public function index(Request $request): Response
    {
        $resources = CareerResource::query()
            ->when($request->input('type'), fn ($q, $type) => $q->where('type', $type))
            ->when($request->input('search'), fn ($q, $search) => $q->where('title', 'like', "%{$search}%"))
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('career-guidance/index', [
            'resources' => $resources,
            'filters' => $request->only(['type', 'search']),
        ]);
    }

    public function create(): Response
    {
        $this->authorizeAdmin();

        return Inertia::render('career-guidance/create');
    }

    public function store(CareerResourceRequest $request): RedirectResponse
    {
        $this->authorizeAdmin();

        $validated = $request->validated();
        $validated['slug'] = Str::slug($validated['title']).'-'.Str::random(5);

        CareerResource::create($validated);

        return redirect()->route('career-guidance.index')->with('success', 'Resource created.');
    }

    public function show(CareerResource $careerResource): Response
    {
        return Inertia::render('career-guidance/show', [
            'resource' => $careerResource,
        ]);
    }

    public function edit(CareerResource $careerResource): Response
    {
        $this->authorizeAdmin();

        return Inertia::render('career-guidance/edit', [
            'resource' => $careerResource,
        ]);
    }

    public function update(CareerResourceRequest $request, CareerResource $careerResource): RedirectResponse
    {
        $this->authorizeAdmin();

        $careerResource->update($request->validated());

        return redirect()->route('career-guidance.index')->with('success', 'Resource updated.');
    }

    public function destroy(CareerResource $careerResource): RedirectResponse
    {
        $this->authorizeAdmin();

        $careerResource->delete();

        return redirect()->route('career-guidance.index')->with('success', 'Resource deleted.');
    }

    private function authorizeAdmin(): void
    {
        abort_unless(auth()->user()->isAdmin(), 403);
    }
}
