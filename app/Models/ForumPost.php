<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ForumPost extends Model
{
    /** @use HasFactory<\Database\Factories\ForumPostFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'forum_category_id',
        'title',
        'slug',
        'body',
        'is_resolved',
        'views_count',
    ];

    protected function casts(): array
    {
        return [
            'is_resolved' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function forumCategory(): BelongsTo
    {
        return $this->belongsTo(ForumCategory::class);
    }

    public function forumComments(): HasMany
    {
        return $this->hasMany(ForumComment::class);
    }
}
