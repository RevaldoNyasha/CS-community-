<?php

namespace App\Http\Controllers\Api;

use App\Enums\FeedItemStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreFeedItemRequest;
use App\Models\FeedItem;
use Illuminate\Http\JsonResponse;

class AutomationFeedController extends Controller
{
    public function store(StoreFeedItemRequest $request): JsonResponse
    {
        $data = $request->validated();

        $title = trim(strip_tags($data['title']));
        $summary = trim(strip_tags($data['summary']));
        $sourceUrl = $data['source_url'];
        $contentHash = hash('sha256', $title.'|'.$sourceUrl);

        // Cross-run de-duplication: skip if the URL or content hash was already ingested.
        $isDuplicate = FeedItem::query()
            ->where('source_url', $sourceUrl)
            ->orWhere('content_hash', $contentHash)
            ->exists();

        if ($isDuplicate) {
            return response()->json([
                'status' => 'skipped',
                'reason' => 'duplicate',
            ], 200);
        }

        $item = FeedItem::create([
            'title' => $title,
            'summary' => $summary,
            'category' => $data['category'],
            'difficulty' => $data['difficulty'] ?? null,
            'tags' => $data['tags'] ?? [],
            'source' => $data['source'],
            'source_url' => $sourceUrl,
            'image_url' => $data['image_url'] ?? null,
            'author' => $data['author'] ?? null,
            'reading_time_minutes' => $data['reading_time_minutes'] ?? null,
            'source_published_at' => $data['source_published_at'] ?? null,
            'content_hash' => $contentHash,
            'status' => FeedItemStatus::Published,
            'published_at' => now(),
        ]);

        return response()->json([
            'status' => 'created',
            'id' => $item->id,
            'slug' => $item->slug,
        ], 201);
    }
}
