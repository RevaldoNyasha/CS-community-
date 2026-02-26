<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    public function index(Request $request): Response
    {
        $users = User::query()
            ->latest()
            ->paginate(10);

        return Inertia::render('admin/users/index', [
            'users' => $users,
        ]);
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        abort_if($user->id === $request->user()->id, 403, 'You cannot delete yourself.');

        $user->delete();

        return back()->with('success', 'User deleted.');
    }

    public function promote(Request $request, User $user): RedirectResponse
    {
        $user->update(['role' => UserRole::Admin]);

        return back()->with('success', "{$user->name} promoted to admin.");
    }

    public function demote(Request $request, User $user): RedirectResponse
    {
        abort_if($user->id === $request->user()->id, 403, 'You cannot demote yourself.');

        $user->update(['role' => UserRole::User]);

        return back()->with('success', "{$user->name} demoted to user.");
    }
}
