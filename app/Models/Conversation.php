<?php

namespace App\Models;

use App\Enums\ConversationStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Conversation extends Model
{
    protected $fillable = [
        'user_one_id',
        'user_two_id',
        'requester_id',
        'status',
        'post_id',
        'last_message_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => ConversationStatus::class,
            'last_message_at' => 'datetime',
        ];
    }

    public function userOne(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_one_id');
    }

    public function userTwo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_two_id');
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function latestMessage(): HasOne
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }

    /** Conversations the user takes part in. */
    public function scopeForUser(Builder $query, User $user): Builder
    {
        return $query->where(fn (Builder $q) => $q
            ->where('user_one_id', $user->id)
            ->orWhere('user_two_id', $user->id));
    }

    /**
     * Conversations that show up in the user's inbox: everything except requests they declined.
     * (The requester keeps seeing a declined request as still pending.)
     */
    public function scopeVisibleTo(Builder $query, User $user): Builder
    {
        return $query->forUser($user)->where(fn (Builder $q) => $q
            ->where('status', '!=', ConversationStatus::Declined->value)
            ->orWhere('requester_id', $user->id));
    }

    /** Find the conversation between two users, if there is one. */
    public static function between(User $a, User $b): ?self
    {
        [$one, $two] = $a->id < $b->id ? [$a->id, $b->id] : [$b->id, $a->id];

        return static::query()->where('user_one_id', $one)->where('user_two_id', $two)->first();
    }

    public function hasParticipant(User $user): bool
    {
        return in_array($user->id, [$this->user_one_id, $this->user_two_id], true);
    }

    public function otherParticipantId(User $user): int
    {
        return $this->user_one_id === $user->id ? $this->user_two_id : $this->user_one_id;
    }

    /** The recipient can only reply after accepting; nobody can post into a declined request. */
    public function canSend(User $user): bool
    {
        return match ($this->status) {
            ConversationStatus::Accepted => true,
            ConversationStatus::Pending, ConversationStatus::Declined => $this->requester_id === $user->id,
        };
    }

    /** How the conversation looks from the user's side: active, incoming request or outgoing request. */
    public function statusFor(User $user): string
    {
        if ($this->status === ConversationStatus::Accepted) {
            return 'active';
        }

        return $this->requester_id === $user->id ? 'outgoing' : 'incoming';
    }
}
