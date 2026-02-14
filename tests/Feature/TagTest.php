<?php

use App\Models\Post;
use App\Models\Tag;
use App\Models\User;

test('users can create a post with tags', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/posts', [
            'title' => 'Tagged Post',
            'content' => 'Content with tags.',
            'type' => 'resource',
            'tags' => 'react, typescript, tailwind',
        ])
        ->assertRedirect(route('dashboard'));

    $post = Post::where('title', 'Tagged Post')->first();

    expect($post->tags)->toHaveCount(3);
    expect($post->tags->pluck('name')->toArray())->toEqualCanonicalizing(['react', 'typescript', 'tailwind']);
});

test('tags are limited to 5', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/posts', [
            'title' => 'Many Tags',
            'content' => 'Testing tag limit.',
            'type' => 'resource',
            'tags' => 'one, two, three, four, five, six, seven',
        ])
        ->assertRedirect(route('dashboard'));

    $post = Post::where('title', 'Many Tags')->first();

    expect($post->tags)->toHaveCount(5);
});

test('tags are created as lowercase', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/posts', [
            'title' => 'Case Test',
            'content' => 'Testing case.',
            'type' => 'resource',
            'tags' => 'React, TypeScript',
        ])
        ->assertRedirect(route('dashboard'));

    $this->assertDatabaseHas('tags', ['name' => 'react']);
    $this->assertDatabaseHas('tags', ['name' => 'typescript']);
});

test('duplicate tags are reused', function () {
    Tag::create(['name' => 'react']);

    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/posts', [
            'title' => 'Reuse Tags',
            'content' => 'Testing reuse.',
            'type' => 'resource',
            'tags' => 'react, vue',
        ])
        ->assertRedirect(route('dashboard'));

    expect(Tag::where('name', 'react')->count())->toBe(1);
    expect(Tag::count())->toBe(2);
});

test('tags appear on dashboard posts', function () {
    $user = User::factory()->create();
    $post = Post::factory()->approved()->create();
    $tag = Tag::create(['name' => 'laravel']);
    $post->tags()->attach($tag);

    $this->actingAs($user)
        ->get('/dashboard')
        ->assertSuccessful();
});

test('popular tags are shown on dashboard', function () {
    $user = User::factory()->create();

    $tag = Tag::create(['name' => 'popular']);
    $posts = Post::factory(3)->approved()->create();
    $posts->each(fn (Post $post) => $post->tags()->attach($tag));

    $response = $this->actingAs($user)
        ->get('/dashboard')
        ->assertSuccessful();

    $popularTags = $response->original->getData()['page']['props']['popularTags'];
    expect($popularTags)->not->toBeEmpty();
});
