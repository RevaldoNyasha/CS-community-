<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ForumComment extends Model
{
    /** @use HasFactory<\Database\Factories\ForumCommentFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'forum_post_id',
        'body',
        'is_best_answer',
    ];

    protected function casts(): array
    {
        return [
            'is_best_answer' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function forumPost(): BelongsTo
    {
        return $this->belongsTo(ForumPost::class);
    }
}
