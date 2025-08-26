<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function show(Request $request)
    {
        $users =  User::paginate(15)->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'identity_document' => $user->identity_document,
                'roles' => $user->getRoleNames(), // Obtiene los nombres de los roles
            ];
        });

        $pagination = User::paginate();

        return Inertia::render('admin/adminuser', [
            'users' => $users,
            'pagination' =>$pagination,
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

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

        // Actualizar roles si los envías desde el front
        if ($request->roles) {
            $user->syncRoles($request->roles);
        }

        return redirect()->back()->with('success', 'Usuario actualizado correctamente.');
    }
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->back()->with('success', 'Usuario eliminado correctamente.');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'identity_document' => 'required|string|max:20|unique:users',
            'phone' => 'required|string|max:15|unique:users',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed', // Confirmación: password_confirmation
            'roles' => 'nullable|array', // Array de roles opcional
        ]);

        $user = User::create([
            'name' => $request->name,
            'identity_document' => $request->identity_document,
            'phone' => $request->phone,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        // Asignar roles si se envían
        if ($request->roles) {
            $user->assignRole($request->roles);
        }

        return redirect()->back()->with('success', 'Usuario creado correctamente.');
    }
}
