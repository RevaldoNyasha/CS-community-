<?php

namespace App\Http\Requests\Post;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'type' => ['required', 'string', 'in:resource,hackathon'],
            'attachment' => ['nullable', 'file', File::types(['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp'])->max(7 * 1024)],
            'tags' => ['nullable', 'string', 'max:255'],
            'event_date' => ['nullable', 'date'],
        ];
    }
}
