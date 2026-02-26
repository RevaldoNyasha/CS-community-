<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Suggestion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminSuggestionController extends Controller
{
    public function index(Request $request): Response
    {
        $suggestions = Suggestion::query()
            ->with('user:id,name')
            ->latest()
            ->paginate(10);

        return Inertia::render('admin/suggestions/index', [
            'suggestions' => $suggestions,
        ]);
    }
}
