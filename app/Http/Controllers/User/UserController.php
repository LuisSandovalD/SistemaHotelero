<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user(); // obtiene solo el usuario autenticado

        return Inertia::render('welcome', [
            'user' => $user,
        ]);
    }
}
