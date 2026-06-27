<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
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

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feed_items');
    }
};
