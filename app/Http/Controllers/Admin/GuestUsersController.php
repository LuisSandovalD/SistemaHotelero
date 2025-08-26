<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;  // Aquí usas User
use Illuminate\Pagination\Paginator;

class GuestUsersController extends Controller
{
   public function show(Request $request)
    {
        $users = User::role('user')->paginate(20); // Solo usuarios con rol 'user'
        $pagination = User::paginate(10);

        return Inertia::render('admin/adminguests', [
            'users' => $users,
            'pagination' => $pagination,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'identity_document' => 'required|string|max:20|unique:users,identity_document',
            'phone' => 'required|string|max:15|unique:users,phone',
            'email' => 'required|email|max:255|unique:users,email',
        ]);

        // Crear el usuario
        $user = User::create([
            'name' => $request->name,
            'identity_document' => $request->identity_document,
            'phone' => $request->phone,
            'email' => $request->email,
            'password' => bcrypt('defaultpassword'), // Contraseña por defecto
        ]);

        // Asignar automáticamente el rol 'user'
        $user->assignRole('user');

        return redirect()->route('admin.adminguests')->with('success', 'Huésped agregado');
    }


    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'identity_document' => 'required|string|max:20|unique:users,identity_document,' . $user->id,
            'phone' => 'required|string|max:15|unique:users,phone,' . $user->id,
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->update([
            'name' => $request->name,
            'identity_document' => $request->identity_document,
            'phone' => $request->phone,
            'email' => $request->email,
        ]);
        

        return redirect()->route('admin.adminguests')->with('success', 'Huésped actualizado');
    }

    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('admin.adminguests')->with('success', 'Huésped eliminado');
    }
}
