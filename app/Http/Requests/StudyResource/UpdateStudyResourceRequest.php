<?php

namespace App\Http\Requests\StudyResource;

use App\Enums\ResourceType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStudyResourceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->id === $this->route('study_resource')->user_id || $this->user()->isAdmin();
    }

    /**
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'subject_id' => ['required', 'exists:subjects,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['required', Rule::enum(ResourceType::class)],
            'file_path' => ['nullable', 'string', 'max:500'],
            'external_url' => ['nullable', 'url', 'max:500'],
            'year' => ['required', 'integer', 'min:2000', 'max:2100'],
            'semester' => ['required', 'integer', 'in:1,2'],
        ];
    }
}
