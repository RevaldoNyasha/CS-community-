<?php

use App\Enums\PostStatus;
use App\Enums\PostType;
use App\Models\Post;

beforeEach(function () {
    config(['services.automation.token' => 'test-automation-token']);
    // The `auto-post` bot user is created by migration (runs via RefreshDatabase).
});

function validAutomationPayload(array $overrides = []): array
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
    $this->postJson('/api/automation/posts', validAutomationPayload())->assertStatus(401);
    expect(Post::count())->toBe(0);
});

test('rejects requests with an invalid token', function () {
    $this->withHeaders(automationHeaders('wrong-token'))
        ->postJson('/api/automation/posts', validAutomationPayload())
        ->assertStatus(401);
    expect(Post::count())->toBe(0);
});

test('rejects invalid payloads', function () {
    $this->withHeaders(automationHeaders())
        ->postJson('/api/automation/posts', validAutomationPayload([
            'category' => 'Not A Real Category',
            'source_url' => 'not-a-url',
        ]))
        ->assertStatus(422)
        ->assertJsonValidationErrors(['category', 'source_url']);
    expect(Post::count())->toBe(0);
});

test('creates an approved resource post authored by the bot user', function () {
    $this->withHeaders(automationHeaders())
        ->postJson('/api/automation/posts', validAutomationPayload())
        ->assertStatus(201)
        ->assertJson(['status' => 'created']);

    $post = Post::with('tags', 'user')->sole();
    expect($post->type)->toBe(PostType::Resource);
    expect($post->status)->toBe(PostStatus::Approved);
    expect($post->user->email)->toBe('auto-post@cs-community.space');
    expect($post->github_url)->toBe('https://example.com/rust-2-0');
    expect($post->content)->toContain('via Hacker News');
    expect($post->tags->pluck('name')->all())->toBe(['rust', 'systems']);
    expect($post->slug)->not->toBeEmpty();
});

test('appears on the public resources page', function () {
    $this->withHeaders(automationHeaders())
        ->postJson('/api/automation/posts', validAutomationPayload());

    $this->get('/resources')->assertSuccessful()->assertSee('Rust 2.0 Released');
});

test('skips duplicate source urls', function () {
    $this->withHeaders(automationHeaders())
        ->postJson('/api/automation/posts', validAutomationPayload())
        ->assertStatus(201);

    $this->withHeaders(automationHeaders())
        ->postJson('/api/automation/posts', validAutomationPayload([
            'title' => 'A different title, same url',
        ]))
        ->assertStatus(200)
        ->assertJson(['status' => 'skipped', 'reason' => 'duplicate']);

    expect(Post::count())->toBe(1);
});

test('sanitizes html from title and summary', function () {
    $this->withHeaders(automationHeaders())
        ->postJson('/api/automation/posts', validAutomationPayload([
            'title' => '<script>alert(1)</script>Clean Title',
            'summary' => '<b>Bold</b> summary text',
        ]))
        ->assertStatus(201);

    $post = Post::sole();
    expect($post->title)->toBe('alert(1)Clean Title');
    expect($post->content)->toContain('Bold summary text');
});
