<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subject extends Model
{
    /** @use HasFactory<\Database\Factories\SubjectFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'part',
        'description',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'part' => 'integer',
        ];
    }

    public function studyResources(): HasMany
    {
        return $this->hasMany(StudyResource::class);
    }

    public function scopeForPart(Builder $query, int $part): Builder
    {
        return $query->where('part', $part);
    }
}
