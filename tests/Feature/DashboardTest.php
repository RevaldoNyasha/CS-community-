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
