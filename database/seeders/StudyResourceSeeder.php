<?php

namespace Database\Seeders;

use App\Models\StudyResource;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Seeder;

class StudyResourceSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $subjects = Subject::all();

        if ($users->isEmpty() || $subjects->isEmpty()) {
            return;
        }

        foreach ($subjects as $subject) {
            StudyResource::factory()
                ->count(fake()->numberBetween(2, 4))
                ->for($subject)
                ->sequence(fn () => ['user_id' => $users->random()->id])
                ->create();
        }
    }
}
