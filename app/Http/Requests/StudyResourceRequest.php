<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StudyResourceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'subject_id' => ['required', 'exists:subjects,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['required', 'string'], // e.g., PDF, Video, Link
            'file_path' => ['nullable', 'string'],
            'external_url' => ['nullable', 'url'],
            'year' => ['required', 'integer', 'min:1', 'max:5'],
            'semester' => ['required', 'integer', 'min:1', 'max:2'],
        ];
    }
}
