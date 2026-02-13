<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Suggestion;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalUsers' => User::count(),
                'totalPosts' => Post::count(),
                'pendingPosts' => Post::pending()->count(),
                'totalSuggestions' => Suggestion::count(),
            ],
            'recentPosts' => Post::query()
                ->with('user:id,name')
                ->latest()
                ->limit(5)
                ->get(),
        ]);
    }
}
