<?php

namespace App\Http\Controllers;

use App\Http\Requests\AnnouncementRequest;
use App\Models\Announcement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    public function index(Request $request): Response
    {
        $announcements = Announcement::query()
            ->with('user:id,name')
            ->orderByDesc('is_pinned')
            ->orderByDesc('created_at')
            ->paginate(15);

        return Inertia::render('announcements/index', [
            'announcements' => $announcements,
        ]);
    }

    public function create(): Response
    {
        $this->authorizeAdmin();

        return Inertia::render('announcements/create');
    }

    public function store(AnnouncementRequest $request): RedirectResponse
    {
        $this->authorizeAdmin();

        $request->user()->announcements()->create($request->validated());

        return redirect()->route('announcements.index')->with('success', 'Announcement created.');
    }

    public function edit(Announcement $announcement): Response
    {
        $this->authorizeAdmin();

        return Inertia::render('announcements/edit', [
            'announcement' => $announcement,
        ]);
    }

    public function update(AnnouncementRequest $request, Announcement $announcement): RedirectResponse
    {
        $this->authorizeAdmin();

        $announcement->update($request->validated());

        return redirect()->route('announcements.index')->with('success', 'Announcement updated.');
    }

    public function destroy(Announcement $announcement): RedirectResponse
    {
        $this->authorizeAdmin();

        $announcement->delete();

        return redirect()->route('announcements.index')->with('success', 'Announcement deleted.');
    }

    private function authorizeAdmin(): void
    {
        abort_unless(auth()->user()->isAdmin(), 403);
    }
}
