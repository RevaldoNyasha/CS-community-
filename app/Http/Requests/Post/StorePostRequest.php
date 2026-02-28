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
            'content' => ['required', 'string', 'max:2000'],
            'type' => ['required', 'string', 'in:resource,hackathon,project'],
            'attachment' => ['nullable', 'file', File::types(['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp'])->max(3 * 1024)],
            'tags' => ['nullable', 'string', 'max:255'],
            'event_date' => ['nullable', 'date'],
            'github_url' => ['nullable', 'url', 'max:500'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'attachment.max' => 'File too large. Please upload a file of 3 MB or less.',
            'attachment.mimes' => 'Invalid file type. Allowed: PDF, JPG, PNG, GIF, WebP.',
            'content.max' => 'Content must not exceed 2000 characters.',
        ];
    }
}
