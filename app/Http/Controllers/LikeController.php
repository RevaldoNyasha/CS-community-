<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function toggle(Request $request, Post $post): RedirectResponse
    {
        $existing = $post->likes()->where('user_id', $request->user()->id)->first();

        if ($existing) {
            $existing->delete();
        } else {
            $post->likes()->create(['user_id' => $request->user()->id]);
        }

        return back();
    }
}
