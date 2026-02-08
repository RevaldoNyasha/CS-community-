<?php

namespace App\Models;

use App\Enums\ResourceType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudyResource extends Model
{
    /** @use HasFactory<\Database\Factories\StudyResourceFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'subject_id',
        'title',
        'description',
        'type',
        'file_path',
        'external_url',
        'year',
        'semester',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => ResourceType::class,
            'year' => 'integer',
            'semester' => 'integer',
            'downloads_count' => 'integer',
        ];
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }
}
