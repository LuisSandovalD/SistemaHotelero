<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 🔹 Crear roles
        $roles = [
            'admin',
            'user',
            'recepcionista',
            'proveedor'
        ];

        foreach ($roles as $roleName) {
            Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
        }

        // 🔹 Crear permisos
        $viewDashboard = Permission::firstOrCreate(['name' => 'ver dashboard', 'guard_name' => 'web']);
        $editArticles  = Permission::firstOrCreate(['name' => 'editar articulos', 'guard_name' => 'web']);

        // Asignar permisos a roles
        Role::where('name', 'admin')->first()->givePermissionTo([$viewDashboard, $editArticles]);
        Role::where('name', 'user')->first()->givePermissionTo([]);
        Role::where('name', 'recepcionista')->first()->givePermissionTo([$viewDashboard]);
        Role::where('name', 'proveedor')->first()->givePermissionTo([]);

        
        $this->call([
            UserSeeder::class,
            TypeRoomSeeder::class,
            RoomStatusSeeder::class,
            PaymentStatusSeeder::class,
            PaymentMethodSeeder::class,
            ReservationStatusSeeder::class,
            ServicesSeeder::class,
            RoomSeeder::class,
            RoomsServicesSeeder::class,
        ]);
    }
}
