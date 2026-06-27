<?php

namespace App\Http\Requests\Api;

use App\Enums\FeedCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFeedItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Authorization is handled by the `automation` middleware (Bearer token).
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'summary' => ['required', 'string', 'max:1000'],
            'category' => ['required', 'string', Rule::in(FeedCategory::values())],
            'difficulty' => ['nullable', 'string', Rule::in(['Beginner', 'Intermediate', 'Advanced'])],
            'tags' => ['nullable', 'array', 'max:5'],
            'tags.*' => ['string', 'max:50'],
            'source' => ['required', 'string', 'max:100'],
            'source_url' => ['required', 'url', 'max:500'],
            'image_url' => ['nullable', 'url', 'max:500'],
            'author' => ['nullable', 'string', 'max:120'],
            'reading_time_minutes' => ['nullable', 'integer', 'min:1', 'max:120'],
            'source_published_at' => ['nullable', 'date'],
        ];
    }
}
