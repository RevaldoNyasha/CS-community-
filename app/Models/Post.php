<?php

namespace App\Models;

use App\Enums\PostStatus;
use App\Enums\PostType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'type',
        'status',
        'user_id',
        'file_path',
        'file_size',
        'event_date',
        'github_url',
    ];

    /** @var list<string> */
    protected $appends = [
        'attachment_url',
        'attachment_is_image',
    ];

    protected function casts(): array
    {
        return [
            'type' => PostType::class,
            'status' => PostStatus::class,
            'event_date' => 'date',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    protected static function booted(): void
    {
        static::creating(function (Post $post): void {
            if (empty($post->slug)) {
                $post->slug = static::generateUniqueSlug($post->title);
            }
        });

        static::deleting(function (Post $post): void {
            if ($post->file_path && Storage::disk('public')->exists($post->file_path)) {
                Storage::disk('public')->delete($post->file_path);
            }
        });
    }

    public static function generateUniqueSlug(string $title): string
    {
        $slug = Str::slug($title);
        $original = $slug;
        $count = 1;

        while (static::where('slug', $slug)->exists()) {
            $slug = "{$original}-{$count}";
            $count++;
        }

        return $slug;
    }

    /** @return Attribute<string|null, never> */
    protected function attachmentUrl(): Attribute
    {
        return Attribute::get(fn (): ?string => $this->file_path
        ? Storage::disk('public')->url($this->file_path)
        : null
        );
    }

    /** @return Attribute<bool, never> */
    protected function attachmentIsImage(): Attribute
    {
        return Attribute::get(function (): bool {
            if (! $this->file_path) {
                return false;
            }

            $extension = strtolower(pathinfo($this->file_path, PATHINFO_EXTENSION));

            return in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp']);
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }

    public function isLikedBy(?User $user): bool
    {
        if ($user === null) {
            return false;
        }

        return $this->likes()->where('user_id', $user->id)->exists();
    }

    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', PostStatus::Approved);
    }

    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', PostStatus::Pending);
    }

    public function scopeOfType(Builder $query, PostType $type): Builder
    {
        return $query->where('type', $type);
    }
}
