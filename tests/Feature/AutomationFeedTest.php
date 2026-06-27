<?php

use App\Models\FeedItem;

beforeEach(function () {
    config(['services.automation.token' => 'test-automation-token']);
});

function validFeedPayload(array $overrides = []): array
{
    return array_merge([
        'title' => 'Rust 2.0 Released',
        'summary' => 'A concise summary of the Rust 2.0 release and its highlights.',
        'category' => 'Programming',
        'difficulty' => 'Intermediate',
        'tags' => ['rust', 'systems'],
        'source' => 'Hacker News',
        'source_url' => 'https://example.com/rust-2-0',
        'image_url' => 'https://example.com/img.png',
        'author' => 'Jane Dev',
        'reading_time_minutes' => 4,
        'source_published_at' => '2026-06-20T10:00:00Z',
    ], $overrides);
}

function automationHeaders(string $token = 'test-automation-token'): array
{
    return ['Authorization' => "Bearer {$token}"];
}

test('rejects requests with no token', function () {
    $this->postJson('/api/automation/posts', validFeedPayload())
        ->assertStatus(401);

    expect(FeedItem::count())->toBe(0);
});

test('rejects requests with an invalid token', function () {
    $this->withHeaders(automationHeaders('wrong-token'))
        ->postJson('/api/automation/posts', validFeedPayload())
        ->assertStatus(401);

    expect(FeedItem::count())->toBe(0);
});

test('rejects invalid payloads', function () {
    $this->withHeaders(automationHeaders())
        ->postJson('/api/automation/posts', validFeedPayload([
            'category' => 'Not A Real Category',
            'source_url' => 'not-a-url',
        ]))
        ->assertStatus(422)
        ->assertJsonValidationErrors(['category', 'source_url']);

    expect(FeedItem::count())->toBe(0);
});

test('creates a published feed item on a valid payload', function () {
    $response = $this->withHeaders(automationHeaders())
        ->postJson('/api/automation/posts', validFeedPayload());

    $response->assertStatus(201)->assertJson(['status' => 'created']);

    $item = FeedItem::sole();
    expect($item->status->value)->toBe('published');
    expect($item->published_at)->not->toBeNull();
    expect($item->slug)->not->toBeEmpty();
    expect($item->content_hash)->not->toBeEmpty();
    expect($item->tags)->toBe(['rust', 'systems']);
    expect($item->author)->toBe('Jane Dev');
    expect($item->reading_time_minutes)->toBe(4);
    expect($item->source_published_at)->not->toBeNull();
});

test('skips duplicate source urls', function () {
    $this->withHeaders(automationHeaders())
        ->postJson('/api/automation/posts', validFeedPayload())
        ->assertStatus(201);

    $this->withHeaders(automationHeaders())
        ->postJson('/api/automation/posts', validFeedPayload([
            'title' => 'A different title, same url',
        ]))
        ->assertStatus(200)
        ->assertJson(['status' => 'skipped', 'reason' => 'duplicate']);

    expect(FeedItem::count())->toBe(1);
});

test('sanitizes html from title and summary', function () {
    $this->withHeaders(automationHeaders())
        ->postJson('/api/automation/posts', validFeedPayload([
            'title' => '<script>alert(1)</script>Clean Title',
            'summary' => '<b>Bold</b> summary text',
        ]))
        ->assertStatus(201);

    $item = FeedItem::sole();
    expect($item->title)->toBe('alert(1)Clean Title');
    expect($item->summary)->toBe('Bold summary text');
});
