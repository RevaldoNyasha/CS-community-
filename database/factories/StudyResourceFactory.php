<?php

namespace Database\Factories;

use App\Enums\ResourceType;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StudyResource>
 */
class StudyResourceFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'subject_id' => Subject::factory(),
            'title' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'type' => fake()->randomElement(ResourceType::cases()),
            'external_url' => fake()->url(),
            'year' => fake()->numberBetween(2020, 2026),
            'semester' => fake()->randomElement([1, 2]),
            'downloads_count' => fake()->numberBetween(0, 500),
        ];
    }
}
