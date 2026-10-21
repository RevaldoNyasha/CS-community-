<?php

namespace App\Http\Controllers;

use App\Enums\PostStatus;
use App\Enums\PostType;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Topic chips on the dashboard. Each matches posts whose tags or title contain one of the keywords as a word.
     *
     * @var array<string, list<string>>
     */
    public const TOPICS = [
        'ai' => ['ai', 'llm', 'gpt', 'openai', 'claude', 'gemini', 'model', 'agent', 'machine learning', 'large language model'],
        'development' => ['development', 'developer', 'dev', 'coding', 'programming', 'web', 'frontend', 'backend', 'javascript', 'python', 'laravel', 'react'],
        'tools' => ['tool', 'copilot', 'automation', 'cli', 'editor', 'productivity'],
        'tutorials' => ['tutorial', 'guide', 'how to', 'learn', 'course'],
        'career' => ['career', 'job', 'interview', 'business', 'internship'],
        'showcase' => ['showcase', 'project', 'side project', 'portfolio', 'built'],
        'news' => ['news', 'release', 'launch', 'update', 'announcement'],
        'discussion' => ['discussion', 'opinion', 'question', 'ask', 'debate'],
    ];

    public const SORTS = ['latest', 'popular', 'discussed'];

    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $search = trim((string) $request->input('search', ''));
        $type = PostType::tryFrom((string) $request->input('type', ''));
        $tagId = $request->integer('tag') ?: null;
        $topic = array_key_exists($request->input('topic'), self::TOPICS) ? $request->input('topic') : null;
        $sort = in_array($request->input('sort'), self::SORTS, true) ? $request->input('sort') : 'latest';

        // Props are closures so filter/search reloads (which ask for `recentPosts` only)
        // skip the other queries entirely.
        return Inertia::render('dashboard', [
            'recentPosts' => fn () => Post::query()
                ->approved()
                ->when($type, fn ($q) => $q->ofType($type))
                ->when($tagId, fn ($q) => $q->whereHas('tags', fn ($q) => $q->whereKey($tagId)))
                ->when($topic, fn ($q) => $this->whereTopic($q, self::TOPICS[$topic]))
                ->when($search, function ($q) use ($search): void {
                    $q->where(function ($q) use ($search): void {
                        $q->where('title', 'like', "%{$search}%")
                            ->orWhere('content', 'like', "%{$search}%");
                    });
                })
                ->with(['user:id,name', 'tags'])
                ->withCount(['comments', 'likes'])
                ->withLikedBy($user)
                ->when($sort === 'popular', fn ($q) => $q->orderByDesc('likes_count'))
                ->when($sort === 'discussed', fn ($q) => $q->orderByDesc('comments_count'))
                ->latest()
                ->limit(20)
                ->get(),
            'pendingCount' => fn () => $user
                ->posts()
                ->where('status', PostStatus::Pending)
                ->count(),
            // Hero numbers. Cached, and cleared whenever a post, user or like changes (FlushesDashboardStats).
            'stats' => fn () => Cache::remember(Post::DASHBOARD_STATS_CACHE_KEY, now()->addHour(), fn () => [
                'posts' => Post::query()->approved()->count(),
                'members' => User::query()->count(),
                'topics' => Tag::query()->whereHas('posts', fn ($q) => $q->approved())->count(),
                'trending' => Post::query()
                    ->approved()
                    ->whereHas('likes', fn ($q) => $q->where('created_at', '>=', now()->subDays(7)))
                    ->count(),
            ]),
            'search' => $search,
            'filters' => [
                'type' => $type?->value,
                'tag' => $tagId,
                'topic' => $topic,
                'sort' => $sort,
            ],
        ]);
    }

    /**
     * Posts with a tag or title containing one of the keywords as a whole word, so "ai" matches
     * "#ai agents" and "New AI model" but not "fair".
     *
     * @param  list<string>  $keywords
     */
    private function whereTopic(Builder $query, array $keywords): void
    {
        $matchWords = function (Builder $q, string $column) use ($keywords): void {
            foreach ($keywords as $keyword) {
                $q->orWhere($column, 'like', $keyword)
                    ->orWhere($column, 'like', "{$keyword} %")
                    ->orWhere($column, 'like', "% {$keyword}")
                    ->orWhere($column, 'like', "% {$keyword} %")
                    ->orWhere($column, 'like', "% {$keyword}s %")
                    ->orWhere($column, 'like', "{$keyword}s %")
                    ->orWhere($column, 'like', "% {$keyword}s");
            }
        };

        $query->where(function (Builder $q) use ($matchWords): void {
            $q->whereHas('tags', fn (Builder $q) => $q->where(fn (Builder $q) => $matchWords($q, 'name')))
                ->orWhere(fn (Builder $q) => $matchWords($q, 'title'));
        });
    }
}
