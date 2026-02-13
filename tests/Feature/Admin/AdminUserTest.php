<?php

use App\Models\User;

test('admin can view users list', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get('/admin/users')
        ->assertSuccessful();
});

test('admin can delete a user', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();

    $this->actingAs($admin)
        ->delete("/admin/users/{$user->id}")
        ->assertRedirect();

    $this->assertDatabaseMissing('users', ['id' => $user->id]);
});

test('admin cannot delete themselves', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->delete("/admin/users/{$admin->id}")
        ->assertForbidden();
});

test('admin can promote a user', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();

    $this->actingAs($admin)
        ->post("/admin/users/{$user->id}/promote")
        ->assertRedirect();

    expect($user->fresh()->role->value)->toBe('admin');
});

test('admin can demote a user', function () {
    $admin = User::factory()->admin()->create();
    $otherAdmin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post("/admin/users/{$otherAdmin->id}/demote")
        ->assertRedirect();

    expect($otherAdmin->fresh()->role->value)->toBe('user');
});

test('admin cannot demote themselves', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post("/admin/users/{$admin->id}/demote")
        ->assertForbidden();
});

test('non-admin cannot access users list', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/admin/users')
        ->assertForbidden();
});
