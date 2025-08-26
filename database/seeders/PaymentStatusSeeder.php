<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PaymentStatus;

class PaymentStatusSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = [
            ['nombre' => 'Pendiente', 'descripcion' => 'Pago aún no realizado'],
            ['nombre' => 'Pagado', 'descripcion' => 'Pago completado'],
            ['nombre' => 'Cancelado', 'descripcion' => 'Pago cancelado'],
        ];

        foreach ($statuses as $status) {
            PaymentStatus::create($status);
        }
    }
}
