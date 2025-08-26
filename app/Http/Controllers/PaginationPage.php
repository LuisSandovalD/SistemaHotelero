<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\TypeRoom;
use App\Models\RoomStatus;
use App\Models\Services;
use App\Models\Invoices;
use App\Models\User;
use App\Models\Payments;
use App\Models\Reservation;
use App\Models\ReservationHistories;
use App\Models\PaymentMethod;
use App\Models\PaymentStatus;
use App\Models\ReservationStatus;

class PaginationPage extends Controller
{
    public function index(){
        return Inertia::render('welcome');
    }
    

    public function room(){         
        $payments = Payments::with([
            'reservation.user',
            'reservation.room.roomStatus',
            'reservation.room.typeRoom',
            'reservation.reservationStatus',
            'paymentMethod',
            'paymentStatus',
        ])->get();

        // Primero: obtener reservas vencidas
        $reservations = Reservation::where('fecha_fin', '<', now())
        ->whereHas('room') // aseguramos que tenga habitación
        ->get();

        $pagination = Room::with(['roomStatus','typeRoom'])->paginate(12);
        $rooms = Room::with(['roomStatus','typeRoom'])->get();  
        return Inertia::render('room', [
            'payments' => $payments, // todos los pagos con su reserva
            'users' => User::all(),
            'pagination' => $pagination,
            'rooms' => $rooms,
            'roomStatuses' => RoomStatus::all(),
            'typeRoom' => TypeRoom::all(),
            'reservationStatus' => ReservationStatus::all(),
            'paymentMethods' => PaymentMethod::all(),
            'paymentStatuses' => PaymentStatus::all(),
        ]);
    }

    public function storeReservation(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'user_name' => 'nullable|string|max:255',
            'user_email' => 'nullable|email',
            'user_phone' => 'nullable|string|max:20',
            'user_identity_document' => 'nullable|string|max:20',
            'room_id' => 'required|exists:rooms,id',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'adultos' => 'nullable|integer|min:0',
            'ninos' => 'nullable|integer|min:0',
            'monto' => 'required|numeric|min:0',
            'payment_method_id' => 'nullable|exists:payment_method,id',
            'referencia' => 'nullable|string|max:255',
            'precio_noche' =>'nullable|numeric|min:0',
        ]);

        // ⚡ Estados por defecto
        $statusOcupada   = RoomStatus::firstOrCreate(['nombre' => 'Ocupada']);
        $statusPendiente = RoomStatus::firstOrCreate(['nombre' => 'Pendiente']);
        $paymentStatus   = PaymentStatus::firstOrCreate(['nombre' => 'Pendiente']);
        $reservationStatus = ReservationStatus::firstOrCreate(['nombre' => 'Pendiente']);

        // 👇 Verificamos si la reserva inicia hoy
        $roomStatusId = (now()->isSameDay($validated['fecha_inicio']))
            ? $statusOcupada->id
            : $statusPendiente->id;

        // Crear reserva
        $reservation = Reservation::create([
            'user_id' => $validated['user_id'],
            'room_id' => $validated['room_id'],
            'fecha_inicio' => $validated['fecha_inicio'],
            'fecha_fin' => $validated['fecha_fin'],
            'adultos' => $validated['adultos'] ?? 1,
            'ninos' => $validated['ninos'] ?? 0,
            'reservation_status_id' => $reservationStatus->id,
            'type_rooms_id' => $request->type_rooms_id, 
            'room_status_id' => $roomStatusId, // 👈 depende de la fecha
        ]);

        // Crear pago asociado a la reserva
        Payments::create([
            'reservation_id' => $reservation->id,
            'monto' => $validated['monto'],
            'payment_method_id' => $validated['payment_method_id'] ?? null,
            'payment_status_id' => $paymentStatus->id,
            'referencia' => $validated['referencia'] ?? null,
            'fecha_pago' => now(),
        ]);


       // Obtener el último número de factura
    $lastInvoice = Invoices::orderBy('id', 'desc')->first();
    $nextNumber  = $lastInvoice ? intval(substr($lastInvoice->numero_factura, -12)) + 1 : 1;

    do {
        $numeroFactura = 'FAC-2508-73889' . str_pad($nextNumber, 12, '0', STR_PAD_LEFT);
        $exists = Invoices::where('numero_factura', $numeroFactura)->exists();
        $nextNumber++;
    } while ($exists);
    

    Invoices::create([
        'reservation_id' => $reservation->id,
        'fecha_emision'  => now(),
        'subtotal'       => $validated['precio_noche'],
        'impuestos'      => $validated['precio_noche']*0.18,
        'descuento'      => 0,
        'total'          => $validated['monto'],
        'numero_factura' => $numeroFactura,
    ]);

        // 🔥 Actualizar la habitación según la lógica
        $room = Room::find($validated['room_id']);
        $room->room_status_id = $roomStatusId;
        $room->save();

         ReservationHistories::create([
            'reservation_id' => $reservation->id,
            'user_id' => $validated['user_id'],
            'observacion' => $validated['payment_status_id'] ?? null,
        ]);

        return redirect()->route('Habitaciones')
            ->with('success', 'Reserva y pago creados correctamente. Estado de la habitación actualizado.');
    }

    public function service(){
        return Inertia::render('service');
    }

    public function galery(){
        return Inertia::render('galery');
    }

    public function contact(){
        return Inertia::render('contact');
    }


    public function reservationHistories(){
        
        return Inertia::render('user/reservationHistories',[
            'reservationhistories'=>ReservationHistories::all(),
            'reservation'=> Reservation::all(),
            'reservationstatus'=>ReservationStatus::all(),
            'invoice'=>Invoices::all(),
            'payment'=> Payments::all(),
            'payment_status'=> PaymentStatus::all(),
        ]);
    }
}
