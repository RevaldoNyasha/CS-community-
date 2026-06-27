<?php

namespace App\Http\Controllers\Api;

use App\Enums\PostStatus;
use App\Enums\PostType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreAutomationPostRequest;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class AutomationFeedController extends Controller
{
    /** Bot user that authors all automated content. Created by migration. */
    private const BOT_EMAIL = 'auto-post@cs-community.space';

    public function store(StoreAutomationPostRequest $request): JsonResponse
    {
        $data = $request->validated();

        $title = trim(strip_tags($data['title']));
        $summary = trim(strip_tags($data['summary']));
        $sourceUrl = $data['source_url'];

        // Cross-run de-duplication: skip if this external URL was already posted.
        if (Post::query()->where('github_url', $sourceUrl)->exists()) {
            return response()->json(['status' => 'skipped', 'reason' => 'duplicate'], 200);
        }

        $bot = User::query()->where('email', self::BOT_EMAIL)->first();
        if (! $bot) {
            return response()->json(['status' => 'error', 'reason' => 'bot user missing'], 500);
        }

        // Body = AI summary, with a small source attribution line.
        $content = $summary;
        if (! empty($data['source'])) {
            $content .= "\n\nvia ".trim(strip_tags($data['source']));
        }

        /** @var Post $post */
        $post = $bot->posts()->create([
            'title' => Str::limit($title, 250, ''),
            'content' => Str::limit($content, 2000, ''),
            'type' => PostType::Resource,
            'status' => PostStatus::Approved,
            'github_url' => $sourceUrl,
        ]);

        $this->syncTags($post, $data['tags'] ?? []);

        return response()->json([
            'status' => 'created',
            'id' => $post->id,
            'slug' => $post->slug,
        ], 201);
    }

    /**
     * @param  array<int, string>  $tags
     */
    private function syncTags(Post $post, array $tags): void
    {
        $names = collect($tags)
            ->map(fn (string $tag): string => strtolower(trim($tag)))
            ->filter()
            ->unique()
            ->take(5);

        if ($names->isEmpty()) {
            return;
        }

        $tagIds = $names->map(fn (string $name): int => Tag::firstOrCreate(['name' => $name])->id);

        $post->tags()->sync($tagIds);
    }
}
