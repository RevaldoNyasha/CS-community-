<?php

use App\Enums\ConversationStatus;
use App\Models\Conversation;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Schema;
use Inertia\Testing\AssertableInertia as Assert;

function sendRequest(User $from, User $to, string $body = 'Hi there', ?Post $post = null)
{
    return test()->actingAs($from)->post(route('messages.requests.store'), [
        'recipient_id' => $to->id,
        'body' => $body,
        'post_id' => $post?->id,
    ]);
}

test('guests are redirected away from messages', function () {
    $this->get(route('messages.index'))->assertRedirect(route('login'));
});

test('members can open an empty inbox', function () {
    $this->actingAs(User::factory()->create());

    $this->get(route('messages.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('messages/index')
            ->has('conversations', 0)
            ->where('active', null));
});

test('the migration only adds the two messaging tables', function () {
    expect(Schema::hasTable('conversations'))->toBeTrue()
        ->and(Schema::hasTable('messages'))->toBeTrue()
        ->and(Schema::hasColumns('users', ['id', 'name', 'email']))->toBeTrue()
        ->and(Schema::hasColumns('posts', ['id', 'title', 'slug']))->toBeTrue();
});

test('sending a request creates a pending conversation and opens it', function () {
    [$alice, $bob] = User::factory(2)->create();
    $post = Post::factory()->approved()->resource()->create(['user_id' => $bob->id]);

    $response = sendRequest($alice, $bob, 'Can I see the marking scheme?', $post);

    $conversation = Conversation::sole();
    $response->assertRedirect(route('messages.index', ['c' => $conversation->id]));

    expect($conversation->status)->toBe(ConversationStatus::Pending)
        ->and($conversation->requester_id)->toBe($alice->id)
        ->and($conversation->post_id)->toBe($post->id)
        ->and($conversation->messages()->sole()->body)->toBe('Can I see the marking scheme?');
});

test('you cannot message yourself', function () {
    $alice = User::factory()->create();

    sendRequest($alice, $alice)->assertSessionHasErrors('recipient_id');
    expect(Conversation::count())->toBe(0);
});

test('a second request to the same person reuses the conversation', function () {
    [$alice, $bob] = User::factory(2)->create();

    sendRequest($alice, $bob, 'First');
    sendRequest($alice, $bob, 'Second');

    expect(Conversation::count())->toBe(1)
        ->and(Conversation::sole()->messages()->count())->toBe(2);
});

test('the recipient sees an incoming request and the sender an outgoing one', function () {
    [$alice, $bob] = User::factory(2)->create();
    sendRequest($alice, $bob);

    $this->actingAs($bob)->get(route('messages.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('conversations.0.status', 'incoming')
            ->where('conversations.0.with.name', $alice->name)
            ->where('conversations.0.unread', true));

    $this->actingAs($alice)->get(route('messages.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('conversations.0.status', 'outgoing')
            ->where('conversations.0.unread', false));
});

test('the recipient must accept before replying', function () {
    [$alice, $bob] = User::factory(2)->create();
    sendRequest($alice, $bob);
    $conversation = Conversation::sole();

    $this->actingAs($bob)
        ->post(route('conversations.messages.store', $conversation), ['body' => 'Too early'])
        ->assertForbidden();

    $this->actingAs($bob)->post(route('conversations.accept', $conversation))->assertRedirect();
    expect($conversation->fresh()->status)->toBe(ConversationStatus::Accepted);

    $this->actingAs($bob)
        ->post(route('conversations.messages.store', $conversation), ['body' => 'Sure!'])
        ->assertRedirect();
    expect($conversation->messages()->count())->toBe(2);
});

test('only the recipient can accept or decline', function () {
    [$alice, $bob] = User::factory(2)->create();
    sendRequest($alice, $bob);
    $conversation = Conversation::sole();

    $this->actingAs($alice)->post(route('conversations.accept', $conversation))->assertForbidden();
    $this->actingAs($alice)->post(route('conversations.decline', $conversation))->assertForbidden();
});

test('declining hides the request from the recipient but not the sender', function () {
    [$alice, $bob] = User::factory(2)->create();
    sendRequest($alice, $bob);
    $conversation = Conversation::sole();

    $this->actingAs($bob)->post(route('conversations.decline', $conversation))
        ->assertRedirect(route('messages.index'));

    $this->actingAs($bob)->get(route('messages.index'))
        ->assertInertia(fn (Assert $page) => $page->has('conversations', 0));

    $this->actingAs($alice)->get(route('messages.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('conversations', 1)
            ->where('conversations.0.status', 'outgoing'));
});

test('outsiders cannot read or post in a conversation', function () {
    [$alice, $bob, $eve] = User::factory(3)->create();
    sendRequest($alice, $bob);
    $conversation = Conversation::sole();

    $this->actingAs($eve)
        ->post(route('conversations.messages.store', $conversation), ['body' => 'Hi'])
        ->assertForbidden();

    $this->actingAs($eve)->get(route('messages.index', ['c' => $conversation->id]))
        ->assertInertia(fn (Assert $page) => $page->where('active', null));
});

test('opening a chat marks it as read and clears the badge', function () {
    [$alice, $bob] = User::factory(2)->create();
    sendRequest($alice, $bob);
    $conversation = Conversation::sole();

    $this->actingAs($bob)->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page->where('unreadMessages', 1));

    $this->actingAs($bob)->get(route('messages.index', ['c' => $conversation->id]))
        ->assertInertia(fn (Assert $page) => $page
            ->where('active.id', $conversation->id)
            ->has('active.messages', 1)
            ->where('active.messages.0.fromMe', false));

    $this->actingAs($bob)->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page->where('unreadMessages', 0));
});

test('replying to an incoming request with a new request accepts it', function () {
    [$alice, $bob] = User::factory(2)->create();
    sendRequest($alice, $bob);

    sendRequest($bob, $alice, 'Hey back');

    expect(Conversation::sole()->status)->toBe(ConversationStatus::Accepted);
});

test('the preview endpoint returns recent chats as json', function () {
    [$alice, $bob] = User::factory(2)->create();
    sendRequest($alice, $bob, 'Hello Bob');

    $this->actingAs($bob)->getJson(route('messages.preview'))
        ->assertOk()
        ->assertJsonPath('conversations.0.with.name', $alice->name)
        ->assertJsonPath('conversations.0.lastMessage.body', 'Hello Bob');
});
