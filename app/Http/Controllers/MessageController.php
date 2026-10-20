<?php

namespace App\Http\Controllers;

use App\Enums\ConversationStatus;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class MessageController extends Controller
{
    /** Inbox, plus the open conversation when `?c=<id>` is given. */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $active = null;

        if ($id = $request->integer('c')) {
            $conversation = $this->summaryQuery($user)->find($id);

            if ($conversation) {
                // Opening a chat marks everything the other person sent as read.
                $conversation->messages()
                    ->where('sender_id', '!=', $user->id)
                    ->whereNull('read_at')
                    ->update(['read_at' => now()]);
                $conversation->unread_count = 0;

                $active = [
                    ...$this->summary($conversation, $user),
                    'messages' => $conversation->messages()
                        ->oldest()
                        ->oldest('id')
                        ->get(['id', 'sender_id', 'body', 'created_at'])
                        ->map(fn (Message $m) => [
                            'id' => $m->id,
                            'body' => $m->body,
                            'fromMe' => $m->sender_id === $user->id,
                            'sentAt' => $m->created_at->toIso8601String(),
                        ]),
                ];
            }
        }

        return Inertia::render('messages/index', [
            'conversations' => $this->summaryQuery($user)
                ->get()
                ->map(fn (Conversation $c) => $this->summary($c, $user)),
            'active' => $active,
        ]);
    }

    /** Latest chats for the navbar dropdown. */
    public function preview(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'conversations' => $this->summaryQuery($user)
                ->limit(6)
                ->get()
                ->map(fn (Conversation $c) => $this->summary($c, $user)),
        ]);
    }

    /** Send a message request to someone (or add to the existing chat with them). */
    public function storeRequest(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'recipient_id' => ['required', 'integer', 'exists:users,id', 'not_in:'.$user->id],
            'body' => ['required', 'string', 'max:1000'],
            'post_id' => ['nullable', 'integer', 'exists:posts,id'],
        ], [
            'recipient_id.not_in' => "You can't message yourself.",
        ]);

        $recipient = User::findOrFail($validated['recipient_id']);

        $conversation = DB::transaction(function () use ($user, $recipient, $validated) {
            $conversation = Conversation::between($user, $recipient);

            if (! $conversation) {
                [$one, $two] = $user->id < $recipient->id
                    ? [$user->id, $recipient->id]
                    : [$recipient->id, $user->id];

                $conversation = Conversation::create([
                    'user_one_id' => $one,
                    'user_two_id' => $two,
                    'requester_id' => $user->id,
                    'status' => ConversationStatus::Pending,
                    'post_id' => $validated['post_id'] ?? null,
                ]);
            } elseif ($conversation->status === ConversationStatus::Pending
                && $conversation->requester_id !== $user->id) {
                // They had already asked to chat with you: replying counts as accepting.
                $conversation->status = ConversationStatus::Accepted;
            }

            if (! empty($validated['post_id'])) {
                $conversation->post_id = $validated['post_id'];
            }

            if (! $conversation->canSend($user)) {
                abort(403, 'You cannot send messages in this conversation.');
            }

            $this->addMessage($conversation, $user, $validated['body']);

            return $conversation;
        });

        return to_route('messages.index', ['c' => $conversation->id]);
    }

    public function send(Request $request, Conversation $conversation): RedirectResponse
    {
        $user = $request->user();
        abort_unless($conversation->hasParticipant($user), 403);
        abort_unless($conversation->canSend($user), 403, 'Accept the request before replying.');

        $validated = $request->validate([
            'body' => ['required', 'string', 'max:1000'],
        ]);

        $this->addMessage($conversation, $user, $validated['body']);

        return to_route('messages.index', ['c' => $conversation->id]);
    }

    public function accept(Request $request, Conversation $conversation): RedirectResponse
    {
        $this->authorizeRecipient($request->user(), $conversation);

        $conversation->update(['status' => ConversationStatus::Accepted]);

        return to_route('messages.index', ['c' => $conversation->id]);
    }

    public function decline(Request $request, Conversation $conversation): RedirectResponse
    {
        $this->authorizeRecipient($request->user(), $conversation);

        $conversation->update(['status' => ConversationStatus::Declined]);

        return to_route('messages.index');
    }

    /** Only the person who received a pending request can accept or decline it. */
    private function authorizeRecipient(User $user, Conversation $conversation): void
    {
        abort_unless(
            $conversation->hasParticipant($user)
                && $conversation->requester_id !== $user->id
                && $conversation->status === ConversationStatus::Pending,
            403,
        );
    }

    private function addMessage(Conversation $conversation, User $user, string $body): void
    {
        $conversation->messages()->create([
            'sender_id' => $user->id,
            'body' => trim($body),
        ]);

        $conversation->last_message_at = now();
        $conversation->save();
    }

    /** @return Builder<Conversation> */
    private function summaryQuery(User $user): Builder
    {
        return Conversation::query()
            ->visibleTo($user)
            ->with([
                'userOne:id,name',
                'userTwo:id,name',
                'post:id,title,slug',
                'latestMessage',
            ])
            ->withCount(['messages as unread_count' => fn (Builder $q) => $q
                ->whereNull('read_at')
                ->where('sender_id', '!=', $user->id)])
            ->orderByDesc('last_message_at')
            ->orderByDesc('id');
    }

    /** The conversation as the front end expects it, seen from the user's side. */
    private function summary(Conversation $conversation, User $user): array
    {
        $other = $conversation->user_one_id === $user->id
            ? $conversation->userTwo
            : $conversation->userOne;
        $last = $conversation->latestMessage;

        return [
            'id' => $conversation->id,
            'with' => ['id' => $other->id, 'name' => $other->name],
            'about' => $conversation->post
                ? ['title' => $conversation->post->title, 'slug' => $conversation->post->slug]
                : null,
            'status' => $conversation->statusFor($user),
            'unread' => $conversation->unread_count > 0,
            'lastMessage' => $last ? [
                'body' => $last->body,
                'fromMe' => $last->sender_id === $user->id,
            ] : null,
            'updatedAt' => ($conversation->last_message_at ?? $conversation->created_at)->toIso8601String(),
        ];
    }
}
