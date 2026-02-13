<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PostStatus;
use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminPostController extends Controller
{
    public function index(Request $request): Response
    {
        $posts = Post::query()
            ->with('user:id,name')
            ->withCount('comments')
            ->when($request->input('type'), fn ($query, $type) => $query->where('type', $type))
            ->when($request->input('status'), fn ($query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate(20);

        return Inertia::render('admin/posts/index', [
            'posts' => $posts,
            'filters' => $request->only(['type', 'status']),
        ]);
    }

    public function approve(Post $post): RedirectResponse
    {
        $post->update(['status' => PostStatus::Approved]);

        return back()->with('success', 'Post approved.');
    }

    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();

        return back()->with('success', 'Post deleted.');
    }
}
