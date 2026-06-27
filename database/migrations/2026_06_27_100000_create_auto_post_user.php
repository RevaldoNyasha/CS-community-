<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

return new class extends Migration
{
    private const BOT_EMAIL = 'auto-post@cs-community.space';

    /**
     * Create the bot user that authors automated content.
     */
    public function up(): void
    {
        if (DB::table('users')->where('email', self::BOT_EMAIL)->exists()) {
            return;
        }

        DB::table('users')->insert([
            'name' => 'auto-post',
            'email' => self::BOT_EMAIL,
            'password' => Hash::make(Str::random(48)),
            'role' => 'user',
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        DB::table('users')->where('email', self::BOT_EMAIL)->delete();
    }
};
