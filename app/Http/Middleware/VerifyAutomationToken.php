<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyAutomationToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $expected = config('services.automation.token');
        $provided = $request->bearerToken();

        if (! is_string($expected) || $expected === '' || ! is_string($provided) || ! hash_equals($expected, $provided)) {
            abort(401, 'Invalid or missing automation token.');
        }

        return $next($request);
    }
}
