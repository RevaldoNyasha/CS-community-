<?php

use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

test('admin can view all posts', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get('/admin/posts')
        ->assertSuccessful();
});

test('admin can approve a pending post', function () {
    $admin = User::factory()->admin()->create();
    $post = Post::factory()->resource()->create();

    $this->actingAs($admin)
        ->post("/admin/posts/{$post->slug}/approve")
        ->assertRedirect();

    expect($post->fresh()->status->value)->toBe('approved');
});

test('admin can delete a post', function () {
    $admin = User::factory()->admin()->create();
    $post = Post::factory()->approved()->resource()->create();

    $this->actingAs($admin)
        ->delete("/admin/posts/{$post->slug}")
        ->assertRedirect();

    $this->assertDatabaseMissing('posts', ['id' => $post->id]);
});

test('admin can view pending posts', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get('/admin/pending')
        ->assertSuccessful();
});

test('non-admin cannot approve posts', function () {
    $user = User::factory()->create();
    $post = Post::factory()->resource()->create();

    $this->actingAs($user)
        ->post("/admin/posts/{$post->slug}/approve")
        ->assertForbidden();
});

test('deleting a post removes its attachment file from storage', function () {
    Storage::fake('firebase');

    $admin = User::factory()->admin()->create();

    $filePath = 'cs-community/test-file.jpg';
    Storage::disk('firebase')->put($filePath, 'fake image content');

    $post = Post::factory()->approved()->resource()->withAttachment($filePath)->create();

    Storage::disk('firebase')->assertExists($filePath);

    $this->actingAs($admin)
        ->delete("/admin/posts/{$post->slug}")
        ->assertRedirect();

    $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    Storage::disk('firebase')->assertMissing($filePath);
});
