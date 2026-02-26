<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PostStatus;
use App\Enums\PostType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAnnouncementRequest;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminAnnouncementController extends Controller
{
    public function index(Request $request): Response
    {
        $announcements = Post::query()
            ->ofType(PostType::Announcement)
            ->approved()
            ->with('user:id,name')
            ->latest()
            ->paginate(10);

        return Inertia::render('admin/announcements/index', [
            'announcements' => $announcements,
        ]);
    }

    public function store(StoreAnnouncementRequest $request): RedirectResponse
    {
        Post::create([
            ...$request->validated(),
            'type' => PostType::Announcement,
            'status' => PostStatus::Approved,
            'user_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Announcement posted.');
    }

    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();

        return back()->with('success', 'Announcement deleted.');
    }
}
