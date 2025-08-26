<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
        
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'phone' => 'required|string|max:15|unique:'.User::class,
            'identity_document' => 'required|string|max:20|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'identity_document' => $request->identity_document,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Extraer dominio del email
        $email = $user->email;
        $domain = substr(strrchr($email, "@"), 1);

        // Redirigir según dominio
        if ($domain === 'recepcionista.com') {
            return redirect()->route('recep.recepindex'); // Cambia a tu ruta de admin
        } elseif ($domain === 'proveedor.com') {
            return redirect()->route('provider.providerindex'); // Cambia a tu ruta de proveedor
        } elseif($domain === 'administrador.com'){
            return redirect()->route('dashboard');
        }

        // Fallback por defecto
        return redirect()->route('home');
    }
}
