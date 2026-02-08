<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CareerResource extends Model
{
    /** @use HasFactory<\Database\Factories\CareerResourceFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'type',
        'content',
        'external_url',
    ];
}
