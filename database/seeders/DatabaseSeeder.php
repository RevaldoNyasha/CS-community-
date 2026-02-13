<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Post;
use App\Models\Suggestion;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seeded admin — no admin signup allowed
        $admin = User::factory()->admin()->create([
            'name' => 'Revaldo',
            'email' => 'admin@site.com',
            'password' => 'nyasha2002',
        ]);

        // Regular users
        $users = User::factory(10)->create();

        // Approved posts
        Post::factory(15)->approved()->resource()->recycle($users)->create();
        Post::factory(10)->approved()->hackathon()->recycle($users)->create();

        // Pending posts
        Post::factory(5)->resource()->recycle($users)->create();
        Post::factory(3)->hackathon()->recycle($users)->create();

        // Announcements (auto-approved, from admin)
        Post::factory(5)->approved()->announcement()->create(['user_id' => $admin->id]);

        // Comments on approved posts
        $approvedPosts = Post::where('status', 'approved')->get();
        foreach ($approvedPosts->random(min(10, $approvedPosts->count())) as $post) {
            Comment::factory(rand(1, 5))->recycle($users)->create(['post_id' => $post->id]);
        }

        // Suggestions
        Suggestion::factory(8)->recycle($users)->create();
    }
}
