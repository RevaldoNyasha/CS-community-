<?php

namespace App\Http\Controllers;

use App\Http\Requests\StudyResourceRequest;
use App\Models\StudyResource;
use App\Models\Subject;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudyResourceController extends Controller
{
    public function index(Request $request): Response
    {
        $resources = StudyResource::query()
            ->with(['user:id,name', 'subject:id,name,code,part'])
            ->when($request->input('type'), fn ($q, $type) => $q->where('type', $type))
            ->when($request->input('part'), fn ($q, $part) => $q->whereHas('subject', fn ($sq) => $sq->where('part', $part)))
            ->when($request->input('subject_id'), fn ($q, $subjectId) => $q->where('subject_id', $subjectId))
            ->when($request->input('search'), fn ($q, $search) => $q->where('title', 'like', "%{$search}%"))
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('study-resources/index', [
            'resources' => $resources,
            'subjects' => Subject::query()->orderBy('part')->orderBy('name')->get(),
            'filters' => $request->only(['type', 'part', 'subject_id', 'search']),
        ]);
    }

    public function show(StudyResource $studyResource): Response
    {
        $studyResource->load(['user:id,name', 'subject:id,name,code,part']);

        return Inertia::render('study-resources/show', [
            'resource' => $studyResource,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('study-resources/create', [
            'subjects' => Subject::query()->orderBy('part')->orderBy('name')->get(),
        ]);
    }

    public function store(StudyResourceRequest $request): RedirectResponse
    {
        $request->user()->studyResources()->create($request->validated());

        return redirect()->route('study-resources.index')->with('success', 'Resource created.');
    }

    public function edit(StudyResource $studyResource): Response
    {
        abort_unless(auth()->id() === $studyResource->user_id || auth()->user()->isAdmin(), 403);

        return Inertia::render('study-resources/edit', [
            'resource' => $studyResource,
            'subjects' => Subject::query()->orderBy('part')->orderBy('name')->get(),
        ]);
    }

    public function update(StudyResourceRequest $request, StudyResource $studyResource): RedirectResponse
    {
        abort_unless(auth()->id() === $studyResource->user_id || auth()->user()->isAdmin(), 403);

        $studyResource->update($request->validated());

        return redirect()->route('study-resources.index')->with('success', 'Resource updated.');
    }

    public function destroy(StudyResource $studyResource): RedirectResponse
    {
        abort_unless(auth()->id() === $studyResource->user_id || auth()->user()->isAdmin(), 403);

        $studyResource->delete();

        return redirect()->route('study-resources.index')->with('success', 'Resource deleted.');
    }
}
