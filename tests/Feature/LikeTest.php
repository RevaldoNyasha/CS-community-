<?php

use App\Models\Post;
use App\Models\User;

test('guests cannot toggle likes', function () {
    $post = Post::factory()->approved()->create();

    $this->post("/posts/{$post->slug}/like")
        ->assertRedirect(route('login'));
});

test('users can like a post', function () {
    $user = User::factory()->create();
    $post = Post::factory()->approved()->create();

    $this->actingAs($user)
        ->post("/posts/{$post->slug}/like")
        ->assertRedirect();

    $this->assertDatabaseHas('likes', [
        'post_id' => $post->id,
        'user_id' => $user->id,
    ]);
});

test('users can unlike a post by toggling', function () {
    $user = User::factory()->create();
    $post = Post::factory()->approved()->create();

    // Like first
    $this->actingAs($user)->post("/posts/{$post->slug}/like");

    $this->assertDatabaseHas('likes', [
        'post_id' => $post->id,
        'user_id' => $user->id,
    ]);

    // Unlike by toggling
    $this->actingAs($user)->post("/posts/{$post->slug}/like");

    $this->assertDatabaseMissing('likes', [
        'post_id' => $post->id,
        'user_id' => $user->id,
    ]);
});

test('post knows if it is liked by a user', function () {
    $user = User::factory()->create();
    $post = Post::factory()->approved()->create();

    expect($post->isLikedBy($user))->toBeFalse();

    $post->likes()->create(['user_id' => $user->id]);

    expect($post->isLikedBy($user))->toBeTrue();
});
