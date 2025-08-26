<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;  // Aquí usas User
use Inertia\Inertia;

use Illuminate\Http\Request;

class ProviderController extends Controller
{
    public function show(){

        $users = User::role('proveedor')->paginate(20); // Solo usuarios con rol 'user'

        return Inertia::render('admin/adminprovider', [
            'users' => $users,
        ]);

    }
}
