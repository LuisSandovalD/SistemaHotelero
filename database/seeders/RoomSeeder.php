<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Room;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        // Ajusta los type_rooms_id y room_status_id si tus ids son distintos
        $rooms = [
            // ===== Piso 1 =====
            ['numero_habitacion' => 101, 'numero_piso' => 1, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 102, 'numero_piso' => 1, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 103, 'numero_piso' => 1, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 104, 'numero_piso' => 1, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 105, 'numero_piso' => 1, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 106, 'numero_piso' => 1, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 107, 'numero_piso' => 1, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 108, 'numero_piso' => 1, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 109, 'numero_piso' => 1, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 110, 'numero_piso' => 1, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 111, 'numero_piso' => 1, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 112, 'numero_piso' => 1, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 113, 'numero_piso' => 1, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 114, 'numero_piso' => 1, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 115, 'numero_piso' => 1, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 116, 'numero_piso' => 1, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 117, 'numero_piso' => 1, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 118, 'numero_piso' => 1, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 119, 'numero_piso' => 1, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 120, 'numero_piso' => 1, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],

            // ===== Piso 2 =====
            ['numero_habitacion' => 201, 'numero_piso' => 2, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 202, 'numero_piso' => 2, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 203, 'numero_piso' => 2, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 204, 'numero_piso' => 2, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 205, 'numero_piso' => 2, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 206, 'numero_piso' => 2, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 207, 'numero_piso' => 2, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 208, 'numero_piso' => 2, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 209, 'numero_piso' => 2, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 210, 'numero_piso' => 2, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 211, 'numero_piso' => 2, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 212, 'numero_piso' => 2, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 213, 'numero_piso' => 2, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 214, 'numero_piso' => 2, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 215, 'numero_piso' => 2, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 216, 'numero_piso' => 2, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 217, 'numero_piso' => 2, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 218, 'numero_piso' => 2, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 219, 'numero_piso' => 2, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 220, 'numero_piso' => 2, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],

            // ===== Piso 3 =====
            ['numero_habitacion' => 301, 'numero_piso' => 3, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 302, 'numero_piso' => 3, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 303, 'numero_piso' => 3, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 304, 'numero_piso' => 3, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 305, 'numero_piso' => 3, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 306, 'numero_piso' => 3, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 307, 'numero_piso' => 3, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 308, 'numero_piso' => 3, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 309, 'numero_piso' => 3, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 310, 'numero_piso' => 3, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 311, 'numero_piso' => 3, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 312, 'numero_piso' => 3, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 313, 'numero_piso' => 3, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 314, 'numero_piso' => 3, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 315, 'numero_piso' => 3, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 316, 'numero_piso' => 3, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 317, 'numero_piso' => 3, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 318, 'numero_piso' => 3, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 319, 'numero_piso' => 3, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 320, 'numero_piso' => 3, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],

            // ===== Piso 4 =====
            ['numero_habitacion' => 401, 'numero_piso' => 4, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 402, 'numero_piso' => 4, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 403, 'numero_piso' => 4, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 404, 'numero_piso' => 4, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 405, 'numero_piso' => 4, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 406, 'numero_piso' => 4, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 407, 'numero_piso' => 4, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 408, 'numero_piso' => 4, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 409, 'numero_piso' => 4, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 410, 'numero_piso' => 4, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 411, 'numero_piso' => 4, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 412, 'numero_piso' => 4, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 413, 'numero_piso' => 4, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 414, 'numero_piso' => 4, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 415, 'numero_piso' => 4, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 416, 'numero_piso' => 4, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 417, 'numero_piso' => 4, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 418, 'numero_piso' => 4, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 419, 'numero_piso' => 4, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 420, 'numero_piso' => 4, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],

            // ===== Piso 5 =====
            ['numero_habitacion' => 501, 'numero_piso' => 5, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 502, 'numero_piso' => 5, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 503, 'numero_piso' => 5, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 504, 'numero_piso' => 5, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 505, 'numero_piso' => 5, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 506, 'numero_piso' => 5, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 507, 'numero_piso' => 5, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 508, 'numero_piso' => 5, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 509, 'numero_piso' => 5, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 510, 'numero_piso' => 5, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 511, 'numero_piso' => 5, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 512, 'numero_piso' => 5, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 513, 'numero_piso' => 5, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 514, 'numero_piso' => 5, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 515, 'numero_piso' => 5, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 516, 'numero_piso' => 5, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 517, 'numero_piso' => 5, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
            ['numero_habitacion' => 518, 'numero_piso' => 5, 'precio_noche' => 150.00, 'capacidad' => 6, 'type_rooms_id' => 2, 'room_status_id' => 1],
            ['numero_habitacion' => 519, 'numero_piso' => 5, 'precio_noche' => 300.00, 'capacidad' => 7, 'type_rooms_id' => 3, 'room_status_id' => 1],
            ['numero_habitacion' => 520, 'numero_piso' => 5, 'precio_noche' => 100.00, 'capacidad' => 5, 'type_rooms_id' => 1, 'room_status_id' => 1],
        ];

        Room::insert($rooms);
    }
}
