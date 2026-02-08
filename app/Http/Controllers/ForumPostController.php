<?php

namespace App\Http\Controllers;

use App\Http\Requests\ForumPostRequest;
use App\Models\ForumCategory;
use App\Models\ForumPost;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ForumPostController extends Controller
{
    public function index(Request $request): Response
    {
        $posts = ForumPost::query()
            ->with(['user:id,name', 'forumCategory:id,name'])
            ->withCount('forumComments')
            ->when($request->input('category_id'), fn ($q, $catId) => $q->where('forum_category_id', $catId))
            ->when($request->input('search'), fn ($q, $search) => $q->where('title', 'like', "%{$search}%"))
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('forum/index', [
            'posts' => $posts,
            'categories' => ForumCategory::all(),
            'filters' => $request->only(['category_id', 'search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('forum/create', [
            'categories' => ForumCategory::all(),
        ]);
    }

    public function store(ForumPostRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['slug'] = Str::slug($validated['title']).'-'.Str::random(5);

        $request->user()->forumPosts()->create($validated);

        return redirect()->route('forum.index')->with('success', 'Post created.');
    }

    public function show(ForumPost $forumPost): Response
    {
        $forumPost->load(['user:id,name', 'forumCategory:id,name', 'forumComments.user:id,name']);
        $forumPost->increment('views_count');

        return Inertia::render('forum/show', [
            'post' => $forumPost,
        ]);
    }

    public function edit(ForumPost $forumPost): Response
    {
        abort_unless(auth()->id() === $forumPost->user_id || auth()->user()->isAdmin(), 403);

        return Inertia::render('forum/edit', [
            'post' => $forumPost,
            'categories' => ForumCategory::all(),
        ]);
    }

    public function update(ForumPostRequest $request, ForumPost $forumPost): RedirectResponse
    {
        abort_unless(auth()->id() === $forumPost->user_id || auth()->user()->isAdmin(), 403);

        $forumPost->update($request->validated());

        return redirect()->route('forum.show', $forumPost)->with('success', 'Post updated.');
    }

    public function destroy(ForumPost $forumPost): RedirectResponse
    {
        abort_unless(auth()->id() === $forumPost->user_id || auth()->user()->isAdmin(), 403);

        $forumPost->delete();

        return redirect()->route('forum.index')->with('success', 'Post deleted.');
    }
}
