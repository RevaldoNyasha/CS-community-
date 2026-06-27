<?php

namespace App\Http\Controllers\Admin;

use App\Enums\FeedItemStatus;
use App\Http\Controllers\Controller;
use App\Models\FeedItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminFeedController extends Controller
{
    public function index(Request $request): Response
    {
        $feedItems = FeedItem::query()
            ->when($request->input('status'), fn ($query, $status) => $query->where('status', $status))
            ->when($request->input('category'), fn ($query, $category) => $query->where('category', $category))
            ->latest('published_at')
            ->paginate(15);

        return Inertia::render('admin/feed/index', [
            'feedItems' => $feedItems,
            'filters' => $request->only(['status', 'category']),
        ]);
    }

    public function destroy(FeedItem $feedItem): RedirectResponse
    {
        $feedItem->update(['status' => FeedItemStatus::Removed]);

        return back()->with('success', 'Feed item removed.');
    }
}
