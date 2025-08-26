<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RoomService;

class RoomsServicesSeeder extends Seeder
{
    public function run(): void
    {
        $rooms = [];

        for ($i = 1; $i <= 100; $i++) { 
            for ($j = 1; $j <= 5; $j++) { 
               $rooms[] = [
                   'room_id' => $i, 
                   'service_id' => $j,
               ];
            }
        }

        RoomService::insert($rooms);
    }
}
