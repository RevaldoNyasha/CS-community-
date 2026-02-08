<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $announcements = Announcement::query()
            ->published()
            ->with('user:id,name')
            ->orderByDesc('is_pinned')
            ->orderByDesc('published_at')
            ->limit(10)
            ->get();

        return Inertia::render('dashboard', [
            'announcements' => $announcements,
        ]);
    }
}
