<?php

use App\Models\User;

test('users can view their suggestions', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/suggestions')
        ->assertSuccessful();
});

test('users can submit a suggestion', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/suggestions', [
            'message' => 'Please add dark mode.',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('suggestions', [
        'user_id' => $user->id,
        'message' => 'Please add dark mode.',
    ]);
});

test('suggestion requires a message', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/suggestions', ['message' => ''])
        ->assertSessionHasErrors(['message']);
});
