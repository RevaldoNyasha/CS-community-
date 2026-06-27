<?php

namespace App\Models;

use App\Enums\FeedItemStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class FeedItem extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'summary',
        'category',
        'difficulty',
        'tags',
        'source',
        'source_url',
        'image_url',
        'author',
        'reading_time_minutes',
        'source_published_at',
        'content_hash',
        'status',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'status' => FeedItemStatus::class,
            'source_published_at' => 'datetime',
            'published_at' => 'datetime',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    protected static function booted(): void
    {
        static::creating(function (FeedItem $item): void {
            if (empty($item->slug)) {
                $item->slug = static::generateUniqueSlug($item->title);
            }
        });
    }

    public static function generateUniqueSlug(string $title): string
    {
        $base = Str::slug($title);
        $original = $base !== '' ? $base : 'item';
        $slug = $original;
        $count = 1;

        while (static::where('slug', $slug)->exists()) {
            $slug = "{$original}-{$count}";
            $count++;
        }

        return $slug;
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', FeedItemStatus::Published);
    }
}
