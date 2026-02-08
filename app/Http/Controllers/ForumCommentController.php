<?php

namespace App\Http\Controllers;

use App\Http\Requests\ForumCommentRequest;
use App\Models\ForumComment;
use App\Models\ForumPost;
use Illuminate\Http\RedirectResponse;

class ForumCommentController extends Controller
{
    public function store(ForumCommentRequest $request, ForumPost $forumPost): RedirectResponse
    {
        $forumPost->forumComments()->create([
            'user_id' => $request->user()->id,
            'body' => $request->body,
        ]);

        return back()->with('success', 'Comment added.');
    }

    public function update(ForumCommentRequest $request, ForumComment $forumComment): RedirectResponse
    {
        abort_unless(auth()->id() === $forumComment->user_id || auth()->user()->isAdmin(), 403);

        $forumComment->update($request->validated());

        return back()->with('success', 'Comment updated.');
    }

    public function destroy(ForumComment $forumComment): RedirectResponse
    {
        abort_unless(auth()->id() === $forumComment->user_id || auth()->user()->isAdmin(), 403);

        $forumComment->delete();

        return back()->with('success', 'Comment deleted.');
    }
}
