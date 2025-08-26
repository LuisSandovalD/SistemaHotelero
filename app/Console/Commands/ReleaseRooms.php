<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Reservation;
use App\Models\RoomStatus;

class ReleaseRooms extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-checkout-rooms';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Actualizar habitaciones en checkout a estado Ocupado';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Estado "Ocupado"
        $ocupadoStatus = RoomStatus::where('nombre', 'ocupada')->first();

        if (!$ocupadoStatus) {
            $this->error('No existe el estado "Ocupada" en la tabla room_status.');
            return;
        }

        // Reservas que terminan HOY
        $reservations = Reservation::whereDate('fecha_fin', now()->toDateString())
            ->whereHas('room')
            ->get();

        foreach ($reservations as $reservation) {
            $reservation->room->update([
                'room_status_id' => $ocupadoStatus->id
            ]);
        }

        $this->info('Habitaciones en checkout actualizadas a Ocupadas correctamente');
    }
}
