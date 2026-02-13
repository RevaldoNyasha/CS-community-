<?php

namespace App\Http\Controllers;

use App\Http\Requests\Comment\StoreCommentRequest;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;

class CommentController extends Controller
{
    public function store(StoreCommentRequest $request, Post $post): RedirectResponse
    {
        $post->comments()->create([
            'user_id' => $request->user()->id,
            'comment' => $request->validated('comment'),
        ]);

        return back()->with('success', 'Comment added.');
    }

    public function destroy(Comment $comment): RedirectResponse
    {
        abort_unless(
            $comment->user_id === auth()->id() || auth()->user()->isAdmin(),
            403,
        );

        $comment->delete();

        return back()->with('success', 'Comment deleted.');
    }
}
