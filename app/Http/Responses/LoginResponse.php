<?php

namespace App\Http\Responses;

use App\Enums\UserRole;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request): mixed
    {
        if ($request->user()->role === UserRole::Admin) {
            return redirect()->intended('/admin');
        }

        return redirect()->intended('/');
    }
}
