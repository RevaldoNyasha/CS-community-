<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('is_admin', true)->first() ?? User::factory()->admin()->create();

        Announcement::factory()->for($admin, 'user')->pinned()->create([
            'title' => 'Welcome to NUST CS Community!',
            'body' => 'Welcome to the NUST Computer Science Community platform. Here you can find study resources, tutorials, forum discussions, career guidance, and more. Get started by exploring the sidebar navigation!',
        ]);

        Announcement::factory()->for($admin, 'user')->count(5)->create();
    }
}
