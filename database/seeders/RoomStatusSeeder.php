<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RoomStatus;

class RoomStatusSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = [
            'Disponible',
            'Ocupada',
            'Mantenimiento',
            'Pendiente',
            'Reservada',
            'Limpieza',
        ];

        foreach ($statuses as $status) {
            RoomStatus::create(['nombre' => $status]);
        }
    }
}
