<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Obtener roles existentes
        $adminRole = Role::where('name', 'admin')->first();
        $userRole = Role::where('name', 'user')->first();
        $recepcionistaRole = Role::where('name', 'recepcionista')->first();
        $proveedorRole = Role::where('name', 'proveedor')->first();

        // Crear administrador único
        $admin = User::firstOrCreate(
            ['email' => 'admin@hotel.test'],
            [
                'name' => 'Admin Hotel',
                'phone' => '123456789',
                'identity_document' => '75189327',
                'password' => Hash::make('Admin1234'),
            ]
        );
        if (!$admin->hasRole($adminRole->name)) {
            $admin->assignRole($adminRole);
        }

        // Lista de usuarios inventados (40 en total)
        $users = [
            // Usuarios normales (25)
            ['name'=>'Luis Torres','email'=>'luis.torres@test.com','phone'=>'900111222','identity_document'=>'11111111','role'=>'user'],
            ['name'=>'Maria Lopez','email'=>'maria.lopez@test.com','phone'=>'900111223','identity_document'=>'11111112','role'=>'user'],
            ['name'=>'Jorge Ramirez','email'=>'jorge.ramirez@test.com','phone'=>'900111224','identity_document'=>'11111113','role'=>'user'],
            ['name'=>'Ana Fernandez','email'=>'ana.fernandez@test.com','phone'=>'900111225','identity_document'=>'11111114','role'=>'user'],
            ['name'=>'Carlos Morales','email'=>'carlos.morales@test.com','phone'=>'900111226','identity_document'=>'11111115','role'=>'user'],
            ['name'=>'Sofia Castillo','email'=>'sofia.castillo@test.com','phone'=>'900111227','identity_document'=>'11111116','role'=>'user'],
            ['name'=>'Diego Herrera','email'=>'diego.herrera@test.com','phone'=>'900111228','identity_document'=>'11111117','role'=>'user'],
            ['name'=>'Valeria Soto','email'=>'valeria.soto@test.com','phone'=>'900111229','identity_document'=>'11111118','role'=>'user'],
            ['name'=>'Fernando Gutierrez','email'=>'fernando.gutierrez@test.com','phone'=>'900111230','identity_document'=>'11111119','role'=>'user'],
            ['name'=>'Paola Mendoza','email'=>'paola.mendoza@test.com','phone'=>'900111231','identity_document'=>'11111120','role'=>'user'],
            ['name'=>'Ricardo Diaz','email'=>'ricardo.diaz@test.com','phone'=>'900111232','identity_document'=>'11111121','role'=>'user'],
            ['name'=>'Camila Alvarez','email'=>'camila.alvarez@test.com','phone'=>'900111233','identity_document'=>'11111122','role'=>'user'],
            ['name'=>'Javier Rojas','email'=>'javier.rojas@test.com','phone'=>'900111234','identity_document'=>'11111123','role'=>'user'],
            ['name'=>'Lucia Paredes','email'=>'lucia.paredes@test.com','phone'=>'900111235','identity_document'=>'11111124','role'=>'user'],
            ['name'=>'Sebastian Vargas','email'=>'sebastian.vargas@test.com','phone'=>'900111236','identity_document'=>'11111125','role'=>'user'],
            ['name'=>'Gabriela Suarez','email'=>'gabriela.suarez@test.com','phone'=>'900111237','identity_document'=>'11111126','role'=>'user'],
            ['name'=>'Andres Molina','email'=>'andres.molina@test.com','phone'=>'900111238','identity_document'=>'11111127','role'=>'user'],
            ['name'=>'Daniela Rivas','email'=>'daniela.rivas@test.com','phone'=>'900111239','identity_document'=>'11111128','role'=>'user'],
            ['name'=>'Martin Chavez','email'=>'martin.chavez@test.com','phone'=>'900111240','identity_document'=>'11111129','role'=>'user'],
            ['name'=>'Isabella Navarro','email'=>'isabella.navarro@test.com','phone'=>'900111241','identity_document'=>'11111130','role'=>'user'],
            ['name'=>'Adrian Ortiz','email'=>'adrian.ortiz@test.com','phone'=>'900111242','identity_document'=>'11111131','role'=>'user'],
            ['name'=>'Natalia Aguirre','email'=>'natalia.aguirre@test.com','phone'=>'900111243','identity_document'=>'11111132','role'=>'user'],
            ['name'=>'Pablo Salazar','email'=>'pablo.salazar@test.com','phone'=>'900111244','identity_document'=>'11111133','role'=>'user'],
            ['name'=>'Karen Fuentes','email'=>'karen.fuentes@test.com','phone'=>'900111245','identity_document'=>'11111134','role'=>'user'],
            ['name'=>'Esteban Roldan','email'=>'esteban.roldan@test.com','phone'=>'900111246','identity_document'=>'11111135','role'=>'user'],

            // Recepcionistas (8)
            ['name'=>'Lorena Pineda','email'=>'lorena.pineda@test.com','phone'=>'900222111','identity_document'=>'22211111','role'=>'recepcionista'],
            ['name'=>'Alberto Vega','email'=>'alberto.vega@test.com','phone'=>'900222112','identity_document'=>'22211112','role'=>'recepcionista'],
            ['name'=>'Cecilia Rojas','email'=>'cecilia.rojas@test.com','phone'=>'900222113','identity_document'=>'22211113','role'=>'recepcionista'],
            ['name'=>'Hector Campos','email'=>'hector.campos@test.com','phone'=>'900222114','identity_document'=>'22211114','role'=>'recepcionista'],
            ['name'=>'Marcela Ibarra','email'=>'marcela.ibarra@test.com','phone'=>'900222115','identity_document'=>'22211115','role'=>'recepcionista'],
            ['name'=>'Oscar Pinto','email'=>'oscar.pinto@test.com','phone'=>'900222116','identity_document'=>'22211116','role'=>'recepcionista'],
            ['name'=>'Liliana Torres','email'=>'liliana.torres@test.com','phone'=>'900222117','identity_document'=>'22211117','role'=>'recepcionista'],
            ['name'=>'Renato Salinas','email'=>'renato.salinas@test.com','phone'=>'900222118','identity_document'=>'22211118','role'=>'recepcionista'],

            // Proveedores (7)
            ['name'=>'Victor Morales','email'=>'victor.morales@test.com','phone'=>'900333111','identity_document'=>'33311111','role'=>'proveedor'],
            ['name'=>'Sandra Peña','email'=>'sandra.pena@test.com','phone'=>'900333112','identity_document'=>'33311112','role'=>'proveedor'],
            ['name'=>'Felipe Castro','email'=>'felipe.castro@test.com','phone'=>'900333113','identity_document'=>'33311113','role'=>'proveedor'],
            ['name'=>'Martha Salcedo','email'=>'martha.salcedo@test.com','phone'=>'900333114','identity_document'=>'33311114','role'=>'proveedor'],
            ['name'=>'Diego Lozano','email'=>'diego.lozano@test.com','phone'=>'900333115','identity_document'=>'33311115','role'=>'proveedor'],
            ['name'=>'Carolina Aguirre','email'=>'carolina.aguirre@test.com','phone'=>'900333116','identity_document'=>'33311116','role'=>'proveedor'],
            ['name'=>'Joaquin Torres','email'=>'joaquin.torres@test.com','phone'=>'900333117','identity_document'=>'33311117','role'=>'proveedor'],
        ];

        // Insertar usuarios
        foreach ($users as $u) {
            $user = User::create([
                'name' => $u['name'],
                'email' => $u['email'],
                'phone' => $u['phone'],
                'identity_document' => $u['identity_document'],
                'password' => Hash::make('Password123'),
            ]);
            $user->assignRole($u['role']);
        }
    }
}
