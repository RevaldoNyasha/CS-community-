<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminPendingController extends Controller
{
    public function index(Request $request): Response
    {
        $posts = Post::query()
            ->pending()
            ->with('user:id,name')
            ->latest()
            ->paginate(10);

        return Inertia::render('admin/pending/index', [
            'posts' => $posts,
        ]);
    }
}
