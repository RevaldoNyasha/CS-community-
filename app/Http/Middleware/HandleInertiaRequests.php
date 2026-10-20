<?php

namespace App\Http\Middleware;

use App\Models\Conversation;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
                'isAdmin' => $request->user()?->isAdmin() ?? false,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
            ],
            // Number of chats with unread messages, for the navbar badge.
            'unreadMessages' => fn () => $this->unreadConversationCount($request),
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }

    private function unreadConversationCount(Request $request): int
    {
        $user = $request->user();

        if (! $user) {
            return 0;
        }

        try {
            return Conversation::query()
                ->visibleTo($user)
                ->whereHas('messages', fn ($q) => $q
                    ->whereNull('read_at')
                    ->where('sender_id', '!=', $user->id))
                ->count();
        } catch (QueryException) {
            // Messaging tables not migrated yet: don't break every page over a badge.
            return 0;
        }
    }
}
