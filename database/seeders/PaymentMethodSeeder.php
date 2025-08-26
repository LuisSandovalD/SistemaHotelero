<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PaymentMethod;

class PaymentMethodSeeder extends Seeder
{
    public function run(): void
    {
        $methods = [
            ['nombre' => 'Efectivo', 'descripcion' => 'Pago en recepción'],
            ['nombre' => 'Tarjeta de crédito', 'descripcion' => 'Pago con tarjeta de crédito'],
            ['nombre' => 'Tarjeta de débito', 'descripcion' => 'Pago con tarjeta de débito'],
            ['nombre' => 'Transferencia', 'descripcion' => 'Pago vía transferencia bancaria'],
        ];

        foreach ($methods as $method) {
            PaymentMethod::create($method);
        }
    }
}
