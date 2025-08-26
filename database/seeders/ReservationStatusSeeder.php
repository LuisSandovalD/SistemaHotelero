<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ReservationStatus;

class ReservationStatusSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = [
            ['nombre' => 'Confirmada', 'descripcion' => 'Reserva confirmada'],
            ['nombre' => 'Pendiente', 'descripcion' => 'Reserva pendiente de confirmación'],
            ['nombre' => 'Cancelada', 'descripcion' => 'Reserva cancelada'],
            ['nombre' => 'En curso', 'descripcion' => 'Estancia en curso'],
            ['nombre' => 'Finalizada', 'descripcion' => 'Estancia finalizada'],
        ];

        foreach ($statuses as $status) {
            ReservationStatus::create($status);
        }
    }
}
