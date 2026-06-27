<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Automated content now lives in the `posts` table (authored by the
     * `auto-post` user), so the dedicated feed_items table is no longer used.
     */
    public function up(): void
    {
        Schema::dropIfExists('feed_items');
    }

    public function down(): void
    {
        Schema::create('feed_items', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('summary');
            $table->string('category');
            $table->string('difficulty')->nullable();
            $table->json('tags')->nullable();
            $table->string('source');
            $table->string('source_url', 500)->unique();
            $table->string('image_url', 500)->nullable();
            $table->string('author')->nullable();
            $table->unsignedInteger('reading_time_minutes')->nullable();
            $table->timestamp('source_published_at')->nullable();
            $table->string('content_hash')->index();
            $table->string('status')->default('published');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }
};
