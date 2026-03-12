<?php

use App\Models\User;

test('admin can view user show page', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();

    $this->actingAs($admin)
        ->get("/admin/users/{$user->id}")
        ->assertSuccessful();
});

test('admin can reset a user password', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();
    $oldHash = $user->password;

    $this->actingAs($admin)
        ->post("/admin/users/{$user->id}/reset-password", ['password' => 'newpassword123'])
        ->assertRedirect("/admin/users/{$user->id}");

    expect($user->fresh()->password)->not->toBe($oldHash);
});

test('reset password requires minimum 8 characters', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();

    $this->actingAs($admin)
        ->post("/admin/users/{$user->id}/reset-password", ['password' => 'short'])
        ->assertSessionHasErrors('password');
});

test('reset password requires a password', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();

    $this->actingAs($admin)
        ->post("/admin/users/{$user->id}/reset-password", ['password' => ''])
        ->assertSessionHasErrors('password');
});

test('non-admin cannot view user show page', function () {
    $user = User::factory()->create();
    $target = User::factory()->create();

    $this->actingAs($user)
        ->get("/admin/users/{$target->id}")
        ->assertForbidden();
});

test('non-admin cannot reset a user password', function () {
    $user = User::factory()->create();
    $target = User::factory()->create();

    $this->actingAs($user)
        ->post("/admin/users/{$target->id}/reset-password", ['password' => 'newpassword123'])
        ->assertForbidden();
});
