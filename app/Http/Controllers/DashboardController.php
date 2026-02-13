<?php

namespace App\Http\Controllers;

use App\Enums\PostStatus;
use App\Enums\PostType;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $recentPosts = Post::query()
            ->approved()
            ->with('user:id,name')
            ->withCount('comments')
            ->latest()
            ->limit(10)
            ->get();

        $announcements = Post::query()
            ->approved()
            ->ofType(PostType::Announcement)
            ->latest()
            ->limit(5)
            ->get();

        $pendingCount = $request->user()
            ->posts()
            ->where('status', PostStatus::Pending)
            ->count();

        return Inertia::render('dashboard', [
            'recentPosts' => $recentPosts,
            'announcements' => $announcements,
            'pendingCount' => $pendingCount,
        ]);
    }
}
