<?php

namespace App\Http\Controllers;

use App\Http\Requests\TestimonialRequest;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;

class TestimonialController extends Controller
{
    public function store(TestimonialRequest $request): RedirectResponse
    {
        $request->user()->testimonials()->create($request->validated());

        return back()->with('success', 'Testimonial submitted.');
    }

    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        abort_unless(auth()->id() === $testimonial->user_id || auth()->user()->isAdmin(), 403);

        $testimonial->delete();

        return back()->with('success', 'Testimonial deleted.');
    }
}
