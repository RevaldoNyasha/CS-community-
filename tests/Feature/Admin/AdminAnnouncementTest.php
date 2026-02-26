<?php

use App\Models\Post;
use App\Models\User;

test('admin can view announcements', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get('/admin/announcements')
        ->assertSuccessful();
});

test('admin can create an announcement', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post('/admin/announcements', [
            'title' => 'System Update',
            'content' => 'The system will be down for maintenance.',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('posts', [
        'title' => 'System Update',
        'type' => 'announcement',
        'status' => 'approved',
        'user_id' => $admin->id,
    ]);
});

test('admin can delete an announcement', function () {
    $admin = User::factory()->admin()->create();
    $post = Post::factory()->approved()->announcement()->create(['user_id' => $admin->id]);

    $this->actingAs($admin)
        ->delete("/admin/announcements/{$post->slug}")
        ->assertRedirect();

    $this->assertDatabaseMissing('posts', ['id' => $post->id]);
});

test('non-admin cannot create announcements', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/admin/announcements', [
            'title' => 'Hack Attempt',
            'content' => 'This should not work.',
        ])
        ->assertForbidden();
});
