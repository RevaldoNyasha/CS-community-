<?php

namespace App\Models;

use App\Models\Concerns\FlushesDashboardStats;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Like extends Model
{
    use FlushesDashboardStats;

    protected $fillable = ['post_id', 'user_id'];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
