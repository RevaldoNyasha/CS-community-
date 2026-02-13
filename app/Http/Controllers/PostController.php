<?php

namespace App\Http\Controllers;

use App\Enums\PostStatus;
use App\Enums\PostType;
use App\Http\Requests\Post\StorePostRequest;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PostController extends Controller
{
    public function index(Request $request): Response
    {
        $type = $request->route()->defaults['type'] ?? $request->input('type');
        $postType = PostType::tryFrom($type);

        $posts = Post::query()
            ->approved()
            ->when($postType, fn ($query) => $query->ofType($postType))
            ->with('user:id,name')
            ->withCount('comments')
            ->latest()
            ->paginate(15);

        $pageMap = [
            'resource' => 'resources/index',
            'hackathon' => 'hackathons/index',
        ];

        $page = $pageMap[$type] ?? 'resources/index';

        return Inertia::render($page, [
            'posts' => $posts,
            'type' => $type,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('posts/create');
    }

    public function store(StorePostRequest $request): RedirectResponse
    {
        $validated = $request->safe()->except('attachment');

        $filePath = null;
        $fileSize = null;

        if ($request->hasFile('attachment')) {
            $filePath = $request->file('attachment')->store('attachments', 'public');
            $fileSize = $request->file('attachment')->getSize();
        }

        $request->user()->posts()->create([
            ...$validated,
            'status' => PostStatus::Pending,
            'file_path' => $filePath,
            'file_size' => $fileSize,
        ]);

        return redirect()->route('dashboard')
            ->with('success', 'Post submitted for approval.');
    }

    public function show(Post $post): Response
    {
        abort_unless(
            $post->status === PostStatus::Approved || $post->user_id === auth()->id() || auth()->user()->isAdmin(),
            403,
        );

        $post->load(['user:id,name', 'comments.user:id,name']);

        return Inertia::render('posts/show', [
            'post' => $post,
        ]);
    }

    public function download(Post $post): StreamedResponse
    {
        abort_unless($post->file_path && Storage::disk('public')->exists($post->file_path), 404);

        return Storage::disk('public')->download($post->file_path);
    }
}
