<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

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
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),

            // Nombre de la app
            'name' => config('app.name'),

            // Frase motivacional
            'quote' => [
                'message' => trim($message),
                'author' => trim($author),
            ],

            // Información del usuario autenticado
            'auth' => [
                'user' => $request->user()
                    ? [
                        'id'    => $request->user()->id,
                        'name'  => $request->user()->name,
                        'email' => $request->user()->email,
                        // 🚀 Si usas Spatie
                        'role'  => $request->user()->getRoleNames()->first(), 
                        // 🚀 Si tu tabla users tiene campo role, cambia por:
                        // 'role' => $request->user()->role,
                    ]
                    : null,
            ],

            // Configuración de Ziggy (para rutas en el frontend)
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],

            // Estado del sidebar (expandido/colapsado)
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') 
                || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
