<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Services;

class ServicesSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            ['nombre' => 'Wi-Fi', 'descripcion' => 'Conexión a internet gratuita'],
            ['nombre' => 'Desayuno', 'descripcion' => 'Desayuno incluido en la tarifa'],
            ['nombre' => 'Piscina', 'descripcion' => 'Acceso a piscina del hotel'],
            ['nombre' => 'Gimnasio', 'descripcion' => 'Acceso al gimnasio del hotel'],
            ['nombre' => 'Estacionamiento', 'descripcion' => 'Estacionamiento privado'],
        ];

        foreach ($services as $service) {
            Services::create($service);
        }
    }
}
