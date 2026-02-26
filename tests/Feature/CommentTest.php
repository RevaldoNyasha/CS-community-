<?php

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;

test('users can add a comment to an approved post', function () {
    $user = User::factory()->create();
    $post = Post::factory()->approved()->resource()->create();

    $this->actingAs($user)
        ->post("/posts/{$post->slug}/comments", [
            'comment' => 'Great resource!',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('comments', [
        'post_id' => $post->id,
        'user_id' => $user->id,
        'comment' => 'Great resource!',
    ]);
});

test('users can delete their own comments', function () {
    $user = User::factory()->create();
    $comment = Comment::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->delete("/comments/{$comment->id}")
        ->assertRedirect();

    $this->assertDatabaseMissing('comments', ['id' => $comment->id]);
});

test('users cannot delete other users comments', function () {
    $user = User::factory()->create();
    $comment = Comment::factory()->create();

    $this->actingAs($user)
        ->delete("/comments/{$comment->id}")
        ->assertForbidden();
});

test('admins can delete any comment', function () {
    $admin = User::factory()->admin()->create();
    $comment = Comment::factory()->create();

    $this->actingAs($admin)
        ->delete("/comments/{$comment->id}")
        ->assertRedirect();

    $this->assertDatabaseMissing('comments', ['id' => $comment->id]);
});
