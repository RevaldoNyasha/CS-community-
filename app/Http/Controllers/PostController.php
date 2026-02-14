<?php

namespace App\Http\Controllers;

use App\Enums\PostStatus;
use App\Enums\PostType;
use App\Http\Requests\Post\StorePostRequest;
use App\Models\Post;
use App\Models\Tag;
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

        $baseQuery = Post::query()
            ->approved()
            ->when($postType, fn($query) => $query->ofType($postType))
            ->when($request->filled('search'), function ($query) use ($request) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('content', 'like', "%{$search}%");
                }
                );
            })
            ->when($request->filled('date_from'), function ($query) use ($request) {
            $query->whereDate('created_at', '>=', $request->input('date_from'));
        })
            ->when($request->filled('date_to'), function ($query) use ($request) {
            $query->whereDate('created_at', '<=', $request->input('date_to'));
        })
            ->when($request->boolean('has_pdf'), function ($query) {
            $query->whereNotNull('file_path')->where('file_path', 'like', '%.pdf');
        })
            ->with(['user:id,name', 'tags'])
            ->withCount(['comments', 'likes']);

        /** @var \App\Models\User|null $user */
        $user = $request->user();

        $pageMap = [
            'resource' => 'resources/index',
            'hackathon' => 'hackathons/index',
        ];

        $page = $pageMap[$type] ?? 'resources/index';

        $filters = [
            'search' => $request->input('search', ''),
            'date_from' => $request->input('date_from', ''),
            'date_to' => $request->input('date_to', ''),
            'has_pdf' => $request->boolean('has_pdf'),
        ];

        // For hackathons, split into upcoming and finished
        if ($type === 'hackathon') {
            $today = now()->toDateString();

            $upcoming = (clone $baseQuery)
                ->where(function ($q) use ($today) {
                $q->whereNull('event_date')
                    ->orWhere('event_date', '>=', $today);
            })
                ->orderBy('event_date', 'asc')
                ->get();

            $finished = (clone $baseQuery)
                ->whereNotNull('event_date')
                ->where('event_date', '<', $today)
                ->orderBy('event_date', 'desc')
                ->get();

            $allPosts = $upcoming->merge($finished);
            $allPosts->each(function (Post $post) use ($user): void {
                $post->setAttribute('is_liked', $post->isLikedBy($user));
            });

            return Inertia::render($page, [
                'upcoming' => $upcoming,
                'finished' => $finished,
                'type' => $type,
                'filters' => $filters,
            ]);
        }

        // Default paginated view for resources
        $posts = $baseQuery->latest()->paginate(15)->withQueryString();
        $posts->getCollection()->each(function (Post $post) use ($user): void {
            $post->setAttribute('is_liked', $post->isLikedBy($user));
        });

        return Inertia::render($page, [
            'posts' => $posts,
            'type' => $type,
            'filters' => $filters,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('posts/create');
    }

    public function store(StorePostRequest $request): RedirectResponse
    {
        $validated = $request->safe()->except(['attachment', 'tags']);

        $filePath = null;
        $fileSize = null;

        if ($request->hasFile('attachment')) {
            $filePath = $request->file('attachment')->store('attachments', 'public');
            $fileSize = $request->file('attachment')->getSize();
        }

        $post = $request->user()->posts()->create([
            ...$validated,
            'status' => PostStatus::Pending,
            'file_path' => $filePath,
            'file_size' => $fileSize,
        ]);

        if ($request->filled('tags')) {
            $tagNames = array_slice(
                array_filter(array_map('trim', explode(',', $request->input('tags')))),
                0,
                5
            );

            $tagIds = collect($tagNames)->map(function (string $name): int {
                return Tag::firstOrCreate(['name' => strtolower($name)])->id;
            });

            $post->tags()->sync($tagIds);
        }

        return redirect()->route('dashboard')
            ->with('success', 'Post submitted for approval.');
    }

    public function show(Post $post): Response
    {
        abort_unless(
            $post->status === PostStatus::Approved || $post->user_id === auth()->id() || auth()->user()->isAdmin(),
            403,
        );

        $post->load(['user:id,name', 'comments.user:id,name', 'tags'])
            ->loadCount(['likes']);
        /** @var \App\Models\User|null $user */
        $user = auth()->user();
        $post->setAttribute('is_liked', $user ? $post->isLikedBy($user) : false);

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
