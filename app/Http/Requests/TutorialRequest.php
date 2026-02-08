<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TutorialRequest extends FormRequest
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
            'tutorial_category_id' => ['required', 'exists:tutorial_categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'url' => ['required', 'url'],
            'platform' => ['required', 'string'],
            'difficulty' => ['required', 'string', 'in:Beginner,Intermediate,Advanced'],
            'is_free' => ['boolean'],
        ];
    }
}
