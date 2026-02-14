<?php

namespace App\Http\Controllers;

use App\Enums\PostStatus;
use App\Enums\PostType;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $recentPosts = Post::query()
            ->approved()
            ->with(['user:id,name', 'tags'])
            ->withCount(['comments', 'likes'])
            ->latest()
            ->limit(10)
            ->get()
            ->each(function (Post $post) use ($user): void {
            $post->setAttribute('is_liked', $post->isLikedBy($user));
        });

        $announcements = Post::query()
            ->approved()
            ->ofType(PostType::Announcement)
            ->latest()
            ->limit(5)
            ->get();

        $pendingCount = $user
            ->posts()
            ->where('status', PostStatus::Pending)
            ->count();

        $popularTags = Tag::query()
            ->withCount('posts')
            ->orderByDesc('posts_count')
            ->limit(10)
            ->get();

        $recentHackathons = Post::query()
            ->approved()
            ->ofType(PostType::Hackathon)
            ->with('user:id,name')
            ->latest()
            ->limit(2)
            ->get();

        return Inertia::render('dashboard', [
            'recentPosts' => $recentPosts,
            'announcements' => $announcements,
            'pendingCount' => $pendingCount,
            'popularTags' => $popularTags,
            'recentHackathons' => $recentHackathons,
        ]);
    }
}
