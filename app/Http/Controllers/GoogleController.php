<?php

namespace App\Http\Controllers;

use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class GoogleController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        $googleUser = Socialite::driver('google')->stateless()->user();

        // Buscamos si el usuario ya existe
        $user = User::where('email', $googleUser->getEmail())->first();

        if (!$user) {
            // Si no existe → lo creamos
            $user = User::create([
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
                'password' => bcrypt(str()->random(16)), // password dummy
            ]);
        }

        // Iniciamos sesión
        Auth::login($user);

        return redirect('/'); // O a donde quieras mandarlo
    }
}