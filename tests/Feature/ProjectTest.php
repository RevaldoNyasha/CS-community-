<?php

use App\Models\Post;
use App\Models\User;

test('guests can view the projects page', function () {
    Post::factory(3)->approved()->project()->create();

    $this->get('/projects')->assertSuccessful();
});

test('guests can view an approved project post', function () {
    $post = Post::factory()->approved()->project()->create();

    $this->get("/posts/{$post->id}")->assertSuccessful();
});

test('guests are redirected to login when submitting a project', function () {
    $this->post('/posts', [
        'title' => 'My Project',
        'content' => 'A cool project.',
        'type' => 'project',
        'github_url' => 'https://github.com/user/repo',
    ])->assertRedirect(route('login'));
});

test('users can create a project with a github url', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/posts', [
            'title' => 'My Project',
            'content' => 'A cool project.',
            'type' => 'project',
            'github_url' => 'https://github.com/user/repo',
        ])
        ->assertRedirect(route('dashboard'));

    $this->assertDatabaseHas('posts', [
        'title' => 'My Project',
        'type' => 'project',
        'github_url' => 'https://github.com/user/repo',
        'user_id' => $user->id,
    ]);
});

test('users can create a project without a github url', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/posts', [
            'title' => 'No GitHub Project',
            'content' => 'A project without a repo link.',
            'type' => 'project',
        ])
        ->assertRedirect(route('dashboard'));

    $this->assertDatabaseHas('posts', [
        'title' => 'No GitHub Project',
        'github_url' => null,
    ]);
});

test('github url must be a valid url', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/posts', [
            'title' => 'Bad URL Project',
            'content' => 'Content here.',
            'type' => 'project',
            'github_url' => 'not-a-url',
        ])
        ->assertSessionHasErrors('github_url');
});
