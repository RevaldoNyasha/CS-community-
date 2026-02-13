<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(),
            'content' => fake()->paragraphs(3, true),
            'type' => fake()->randomElement(['resource', 'hackathon']),
            'status' => 'pending',
            'user_id' => User::factory(),
        ];
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
        ]);
    }

    public function resource(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'resource',
        ]);
    }

    public function hackathon(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'hackathon',
        ]);
    }

    public function announcement(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'announcement',
        ]);
    }

    public function withAttachment(string $filePath = 'attachments/test.jpg', int $fileSize = 1024): static
    {
        return $this->state(fn (array $attributes) => [
            'file_path' => $filePath,
            'file_size' => $fileSize,
        ]);
    }
}
