<?php

use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});
test('the dashboard feed can be filtered by post type', function () {
    $this->actingAs(User::factory()->create());
    Post::factory()->approved()->resource()->create(['title' => 'A resource post']);
    Post::factory()->approved()->hackathon()->create(['title' => 'A hackathon post']);

    $this->get(route('dashboard', ['type' => 'hackathon']))
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('recentPosts', 1)
            ->where('recentPosts.0.title', 'A hackathon post')
            ->where('filters.type', 'hackathon'));
});

test('the dashboard feed can be filtered by tag', function () {
    $this->actingAs(User::factory()->create());
    $tag = Tag::create(['name' => 'laravel']);
    Post::factory()->approved()->resource()->create(['title' => 'Tagged post'])->tags()->attach($tag);
    Post::factory()->approved()->resource()->create(['title' => 'Untagged post']);

    $this->get(route('dashboard', ['tag' => $tag->id]))
        ->assertInertia(fn (Assert $page) => $page
            ->has('recentPosts', 1)
            ->where('recentPosts.0.title', 'Tagged post')
            ->where('filters.tag', $tag->id));
});

test('an unknown dashboard post type is ignored', function () {
    $this->actingAs(User::factory()->create());
    Post::factory(2)->approved()->resource()->create();

    $this->get(route('dashboard', ['type' => 'nonsense']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('recentPosts', 2)
            ->where('filters.type', null));
});

test('the dashboard feed can be filtered by topic', function () {
    $this->actingAs(User::factory()->create());
    $tag = Tag::create(['name' => 'llm']);
    Post::factory()->approved()->resource()->create(['title' => 'Prompting tips'])->tags()->attach($tag);
    Post::factory()->approved()->resource()->create(['title' => 'Career fair']);

    $this->get(route('dashboard', ['topic' => 'ai']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('recentPosts', 1)
            ->where('recentPosts.0.title', 'Prompting tips')
            ->where('filters.topic', 'ai'));
});

test('the dashboard feed can be sorted by most liked', function () {
    $this->actingAs(User::factory()->create());
    Post::factory()->approved()->resource()->create(['title' => 'Quiet post']);
    $liked = Post::factory()->approved()->resource()->create(['title' => 'Liked post', 'created_at' => now()->subDay()]);
    $liked->likes()->create(['user_id' => User::factory()->create()->id]);

    $this->get(route('dashboard', ['sort' => 'popular']))
        ->assertInertia(fn (Assert $page) => $page
            ->where('recentPosts.0.title', 'Liked post')
            ->where('filters.sort', 'popular'));
});

test('the dashboard shows community stats', function () {
    $this->actingAs(User::factory()->create());
    Post::factory(3)->approved()->resource()->create();

    $this->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('stats.posts', 3)
            ->has('stats.members')
            ->has('stats.topics')
            ->has('stats.trending'));
});

test('the dashboard stats update as soon as the data changes', function () {
    $this->actingAs($user = User::factory()->create());
    $pending = Post::factory()->resource()->for($user)->create();
    Post::factory()->approved()->resource()->for($user)->create();

    $this->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page->where('stats.posts', 1)->where('stats.trending', 0));

    $pending->update(['status' => 'approved']);
    $pending->likes()->create(['user_id' => User::factory()->create()->id]);

    $this->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('stats.posts', 2)
            ->where('stats.members', User::count())
            ->where('stats.trending', 1));
});
