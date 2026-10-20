<?php

namespace App\Http\Controllers;

use App\Enums\PostStatus;
use App\Enums\PostType;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $search = trim((string) $request->input('search', ''));
        $type = PostType::tryFrom((string) $request->input('type', ''));
        $tagId = $request->integer('tag') ?: null;

        // Props are closures so filter/search reloads (which ask for `recentPosts` only)
        // skip the other queries entirely.
        return Inertia::render('dashboard', [
            'recentPosts' => fn () => Post::query()
                ->approved()
                ->when($type, fn ($q) => $q->ofType($type))
                ->when($tagId, fn ($q) => $q->whereHas('tags', fn ($q) => $q->whereKey($tagId)))
                ->when($search, function ($q) use ($search): void {
                    $q->where(function ($q) use ($search): void {
                        $q->where('title', 'like', "%{$search}%")
                            ->orWhere('content', 'like', "%{$search}%");
                    });
                })
                ->with(['user:id,name', 'tags'])
                ->withCount(['comments', 'likes'])
                ->withLikedBy($user)
                ->latest()
                ->limit(20)
                ->get(),
            'pendingCount' => fn () => $user
                ->posts()
                ->where('status', PostStatus::Pending)
                ->count(),
            // Changes slowly, so it is cached rather than queried on every visit.
            'popularTags' => fn () => Cache::remember(
                'dashboard:popular-tags',
                now()->addMinutes(10),
                fn () => Tag::query()
                    ->withCount('posts')
                    ->orderByDesc('posts_count')
                    ->limit(10)
                    ->get(),
            ),
            'search' => $search,
            'filters' => [
                'type' => $type?->value,
                'tag' => $tagId,
            ],
        ]);
    }
}
