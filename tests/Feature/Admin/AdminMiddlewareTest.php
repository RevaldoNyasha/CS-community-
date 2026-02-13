<?php

use App\Models\User;

test('guests are redirected to login from admin routes', function () {
    $this->get('/admin')->assertRedirect(route('login'));
});

test('non-admin users get 403 on admin routes', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/admin')
        ->assertForbidden();
});

test('admin users can access admin routes', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->get('/admin')
        ->assertSuccessful();
});
