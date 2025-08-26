<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\User;
use App\Models\Room;
use App\Models\ReservationStatus;
use App\Models\PaymentMethod;
use App\Models\PaymentStatus;
use App\Models\TypeRoom;
use App\Models\ReservationHistories;
use App\Models\RoomStatus;
use App\Models\Invoices;
use App\Models\Payments;
use Carbon\Carbon;


use Illuminate\Http\Request;
use Inertia\Inertia;


class ReservationController extends Controller
{
    // Mostrar todas las reservas + datos para selects
   public function show()
    {
        $payments = Payments::with([
            'reservation.user',
            'reservation.room.roomStatus',
            'reservation.room.typeRoom',
            'reservation.reservationStatus',
            'paymentMethod',
            'paymentStatus',
        ])->get();

        $pagination= Payments::paginate();

        // Primero: obtener reservas vencidas
        $reservations = Reservation::where('fecha_fin', '<', now())
        ->whereHas('room') // aseguramos que tenga habitación
        ->get();

        return Inertia::render('admin/adminreservation', [
            'payments' => $payments, // todos los pagos con su reserva
            'users' => User::all(),
            'rooms' => Room::with(['roomStatus','typeRoom'])->get(),
            'roomStatuses' => RoomStatus::all(), 
            'typeRoom' => TypeRoom::all(),
            'reservationStatus' => ReservationStatus::all(),
            'paymentMethods' => PaymentMethod::all(),
            'paymentStatuses' => PaymentStatus::all(),
            'pagination'=>$pagination,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'user_name' => 'required_without:user_id|string|max:255',
            'user_email' => 'required_without:user_id|email',
            'user_phone' => 'nullable|string|max:20',
            'user_identity_document' => 'nullable|string|max:20',
            'room_id' => 'required|exists:rooms,id',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'adultos' => 'required|integer|min:0',
            'ninos' => 'required|integer|min:0',
            'reservation_status_id' => 'required|exists:reservation_status,id',
            'type_rooms_id' => 'required|exists:type_rooms,id',
            'precio_noche' =>'required|numeric|min:0',
            'room_status_id' => 'required|exists:room_status,id', // <- aquí seleccionas el estado
            'monto' => 'required|numeric|min:0',
            'payment_method_id' => 'required|exists:payment_method,id',
            'payment_status_id' => 'nullable|exists:payment_status,id',
            'referencia' => 'nullable|string|max:255',
        ]);

        // Crear PaymentStatus por defecto si no existe
        if (empty($validated['payment_status_id'])) {
            $paymentStatus = PaymentStatus::firstOrCreate(['nombre' => 'Pendiente']);
            $validated['payment_status_id'] = $paymentStatus->id;
        }

        // Crear usuario si no existe
        if (empty($validated['user_id'])) {
            $user = User::create([
                'name' => $validated['user_name'],
                'email' => $validated['user_email'] ?? null,
                'phone' => $validated['user_phone'] ?? null,
                'identity_document' => $validated['user_identity_document'] ?? null,
                'password' => bcrypt('defaultpassword'),
            ]);
            $validated['user_id'] = $user->id;
        }

        // Crear reserva
        $reservation = Reservation::create([
            'user_id' => $validated['user_id'],
            'room_id' => $validated['room_id'],
            'fecha_inicio' => $validated['fecha_inicio'],
            'fecha_fin' => $validated['fecha_fin'],
            'adultos' => $validated['adultos'],
            'ninos' => $validated['ninos'],
            'reservation_status_id' => $validated['reservation_status_id'],
            'type_rooms_id' => $validated['type_rooms_id'],
            'room_status_id' => $validated['room_status_id'], // <- se guarda el estado que seleccionaste
        ]);

        // Actualizar estado de la habitación
        $room = Room::find($validated['room_id']);
        if ($room) {
            $room->room_status_id = $validated['room_status_id'];
            $room->save();
        }

        // Crear pago asociado a la reserva
        Payments::create([
            'reservation_id' => $reservation->id,
            'monto' => $validated['monto'],
            'payment_method_id' => $validated['payment_method_id'],
            'payment_status_id' => $validated['payment_status_id'],
            'referencia' => $validated['referencia'] ?? null,
            'fecha_pago' => now(),
        ]);
           // Obtener el último número de factura
        $lastInvoice = Invoices::orderBy('id', 'desc')->first();
        $nextNumber  = $lastInvoice ? intval(substr($lastInvoice->numero_factura, -12)) + 1 : 1;

        do {
            $numeroFactura = 'FAC-2508-738839' . str_pad($nextNumber, 12, '0', STR_PAD_LEFT);
            $exists = Invoices::where('numero_factura', $numeroFactura)->exists();
            $nextNumber++;
        } while ($exists);

        Invoices::create([
            'reservation_id' => $reservation->id,
            'fecha_emision'  => now(),
            'subtotal'       => $validated['precio_noche'],
            'impuestos'      => $validated['precio_noche'] * 0.18,
            'descuento'      => 0,
            'total'          => $validated['monto'],
            'numero_factura' => $numeroFactura,
        ]);

        ReservationHistories::create([
            'reservation_id' => $reservation->id,
            'user_id' => $validated['user_id'],
            'observacion' => $validated['payment_status_id'] ?? null,
        ]);

        return redirect()->route('admin.adminreservation')->with('success', 'Reserva y pago creados correctamente');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'user_name' => 'required_without:user_id|string|max:255',
            'user_email' => 'required_without:user_id|email',
            'user_phone' => 'nullable|string|max:20',
            'user_identity_document' => 'nullable|string|max:20',
            'room_id' => 'required|exists:rooms,id',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'adultos' => 'required|integer|min:0',
            'ninos' => 'required|integer|min:0',
            'reservation_status_id' => 'required|exists:reservation_status,id',
            'type_rooms_id' => 'required|exists:type_rooms,id',
            'room_status_id' => 'required|exists:room_status,id',
            'monto' => 'required|numeric|min:0',
            'payment_method_id' => 'required|exists:payment_method,id',
            'payment_status_id' => 'nullable|exists:payment_status,id',
            'referencia' => 'nullable|string|max:255',
        ]);

        // Obtener la reserva y el pago asociados
        $payment = Payments::findOrFail($id);
        $reservation = $payment->reservation;

        // Actualizar o crear usuario si no existe
        if (empty($validated['user_id'])) {
            $user = User::create([
                'name' => $validated['user_name'],
                'email' => $validated['user_email'] ?? null,
                'phone' => $validated['user_phone'] ?? null,
                'identity_document' => $validated['user_identity_document'] ?? null,
                'password' => bcrypt('defaultpassword'),
            ]);
            $validated['user_id'] = $user->id;
        } else {
            // Si hay user_id, actualizar datos opcionales
            $user = User::find($validated['user_id']);
            $user->update([
                'name' => $validated['user_name'] ?? $user->name,
                'email' => $validated['user_email'] ?? $user->email,
                'phone' => $validated['user_phone'] ?? $user->phone,
                'identity_document' => $validated['user_identity_document'] ?? $user->identity_document,
            ]);
        }

        // Actualizar reserva
        $reservation->update([
            'user_id' => $validated['user_id'],
            'room_id' => $validated['room_id'],
            'fecha_inicio' => $validated['fecha_inicio'],
            'fecha_fin' => $validated['fecha_fin'],
            'adultos' => $validated['adultos'],
            'ninos' => $validated['ninos'],
            'reservation_status_id' => $validated['reservation_status_id'],
            'type_rooms_id' => $validated['type_rooms_id'],
            'room_status_id' => $validated['room_status_id'],
        ]);

        // Actualizar estado de la habitación
        $room = Room::find($validated['room_id']);
        if ($room) {
            $room->update([
                'room_status_id' => $validated['room_status_id']
            ]);
        }
        
        $today = Carbon::today();
        $expiredReservations = Reservation::where('fecha_fin', '<', $today)->get();

        foreach ($expiredReservations as $reservation) {
            $room = Room::find($reservation->room_id);
            if ($room) {
                $room->room_status_id = 1; // Disponible
                $room->save();
            }
        }

        // Actualizar pago
        $payment->update([
            'monto' => $validated['monto'],
            'payment_method_id' => $validated['payment_method_id'],
            'payment_status_id' => $validated['payment_status_id'] ?? $payment->payment_status_id,
            'referencia' => $validated['referencia'] ?? $payment->referencia,
            'fecha_pago' => now(),
        ]);

        return redirect()->route('admin.adminreservation')->with('success', 'Reserva y pago actualizados correctamente');
    }

    // Eliminar reserva
    public function destroy(Reservation $reservation)
    {
        $reservation->delete();
        $room = Room::find($reservation->room_id);
        if ($room) {
            $room->room_status_id = 1; // Disponible
            $room->save();
        }
        return redirect()->route('admin.adminreservation')->with('success', 'Reserva eliminada correctamente');
    }
}
