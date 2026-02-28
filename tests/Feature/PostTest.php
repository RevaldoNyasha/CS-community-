<?php

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('guests can view the resources page', function () {
    Post::factory(3)->approved()->resource()->create();

    $this->get('/resources')->assertSuccessful();
});

test('guests can view the hackathons page', function () {
    Post::factory(3)->approved()->hackathon()->create();

    $this->get('/hackathons')->assertSuccessful();
});

test('guests can view an approved post', function () {
    $post = Post::factory()->approved()->resource()->create();

    $this->get("/posts/{$post->slug}")->assertSuccessful();
});

test('guests cannot view a pending post', function () {
    $post = Post::factory()->resource()->create(); // pending by default

    $this->get("/posts/{$post->slug}")->assertForbidden();
});

test('guests are redirected to login when accessing post create page', function () {
    $this->get('/posts/create')->assertRedirect(route('login'));
});

test('guests are redirected to login when submitting a post', function () {
    $this->post('/posts', [
        'title' => 'Unauthorized',
        'content' => 'Content here.',
        'type' => 'resource',
    ])->assertRedirect(route('login'));
});

test('guests are redirected to login when commenting', function () {
    $post = Post::factory()->approved()->resource()->create();

    $this->post("/posts/{$post->slug}/comments", [
        'comment' => 'Hello',
    ])->assertRedirect(route('login'));
});

test('users can view approved resources', function () {
    $user = User::factory()->create();
    Post::factory(3)->approved()->resource()->create();

    $this->actingAs($user)
        ->get('/resources')
        ->assertSuccessful();
});

test('users can view approved hackathons', function () {
    $user = User::factory()->create();
    Post::factory(3)->approved()->hackathon()->create();

    $this->actingAs($user)
        ->get('/hackathons')
        ->assertSuccessful();
});

test('users can view the post creation page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/posts/create')
        ->assertSuccessful();
});

test('users can create a post with pending status', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/posts', [
            'title' => 'My Resource',
            'content' => 'Great content here.',
            'type' => 'resource',
        ])
        ->assertRedirect(route('dashboard'));

    $this->assertDatabaseHas('posts', [
        'title' => 'My Resource',
        'status' => 'pending',
        'user_id' => $user->id,
    ]);
});

test('users can view a single approved post', function () {
    $user = User::factory()->create();
    $post = Post::factory()->approved()->resource()->create();

    $this->actingAs($user)
        ->get("/posts/{$post->slug}")
        ->assertSuccessful();
});

test('users cannot view other users pending posts', function () {
    $user = User::factory()->create();
    $post = Post::factory()->resource()->create(); // pending by default

    $this->actingAs($user)
        ->get("/posts/{$post->slug}")
        ->assertForbidden();
});

test('users can view their own pending posts', function () {
    $user = User::factory()->create();
    $post = Post::factory()->resource()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get("/posts/{$post->slug}")
        ->assertSuccessful();
});

test('post creation requires title and content', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/posts', [
            'title' => '',
            'content' => '',
            'type' => 'resource',
        ])
        ->assertSessionHasErrors(['title', 'content']);
});

test('users can create a post with an image attachment', function () {
    Storage::fake('firebase');
    $user = User::factory()->create();

    $file = UploadedFile::fake()->image('photo.jpg', 640, 480)->size(500);

    $this->actingAs($user)
        ->post('/posts', [
            'title' => 'Post with Image',
            'content' => 'Has an image.',
            'type' => 'resource',
            'attachment' => $file,
        ])
        ->assertRedirect(route('dashboard'));

    $post = Post::where('title', 'Post with Image')->first();

    expect($post->file_path)->not->toBeNull();
    Storage::disk('firebase')->assertExists($post->file_path);
    expect($post->attachment_is_image)->toBeTrue();
});

test('users can create a post with a pdf attachment', function () {
    Storage::fake('firebase');
    $user = User::factory()->create();

    $file = UploadedFile::fake()->create('document.pdf', 500, 'application/pdf');

    $this->actingAs($user)
        ->post('/posts', [
            'title' => 'Post with PDF',
            'content' => 'Has a PDF.',
            'type' => 'resource',
            'attachment' => $file,
        ])
        ->assertRedirect(route('dashboard'));

    $post = Post::where('title', 'Post with PDF')->first();

    expect($post->file_path)->not->toBeNull();
    Storage::disk('firebase')->assertExists($post->file_path);
    expect($post->attachment_is_image)->toBeFalse();
});

test('users can create a post without an attachment', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/posts', [
            'title' => 'No Attachment',
            'content' => 'Just text.',
            'type' => 'resource',
        ])
        ->assertRedirect(route('dashboard'));

    $post = Post::where('title', 'No Attachment')->first();

    expect($post->file_path)->toBeNull();
    expect($post->attachment_url)->toBeNull();
    expect($post->attachment_is_image)->toBeFalse();
});

test('attachment upload rejects files larger than 7mb', function () {
    Storage::fake('firebase');
    $user = User::factory()->create();

    $file = UploadedFile::fake()->create('large.pdf', 8000, 'application/pdf');

    $this->actingAs($user)
        ->post('/posts', [
            'title' => 'Too Large',
            'content' => 'Big file.',
            'type' => 'resource',
            'attachment' => $file,
        ])
        ->assertSessionHasErrors('attachment');
});

test('attachment upload rejects invalid file types', function () {
    Storage::fake('firebase');
    $user = User::factory()->create();

    $file = UploadedFile::fake()->create('script.exe', 100, 'application/x-msdownload');

    $this->actingAs($user)
        ->post('/posts', [
            'title' => 'Bad Type',
            'content' => 'Invalid file.',
            'type' => 'resource',
            'attachment' => $file,
        ])
        ->assertSessionHasErrors('attachment');
});
