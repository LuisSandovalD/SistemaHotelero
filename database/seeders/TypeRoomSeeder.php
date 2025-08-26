<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TypeRoom;

class TypeRoomSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            ['nombre' => 'Individual', 'descripcion' => 'Habitación para una persona'],
            ['nombre' => 'Doble', 'descripcion' => 'Habitación para dos personas'],
            ['nombre' => 'Suite', 'descripcion' => 'Habitación de lujo con sala de estar'],
        ];

        foreach ($types as $type) {
            TypeRoom::create($type);
        }
    }
}
