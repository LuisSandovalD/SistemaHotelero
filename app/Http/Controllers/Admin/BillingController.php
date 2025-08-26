<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payments;
use App\Models\User;
use App\Models\Room;
use App\Models\RoomStatus;
use App\Models\TypeRoom;
use App\Models\ReservationStatus;
use App\Models\Reservation;
use App\Models\Invoices;
use Inertia\Inertia;

class BillingController extends Controller
{
    public function show(){

        $pagination = Invoices::paginate(5);

        $paymentPendiente = Invoices::where('estado','emitida')->count();
        $paymentConfirmadas = Invoices::where('estado','pagada')->count();
        $paymentAnuladas = Invoices::where('estado','anulada')->count();

        $invoices = Invoices::with([
            'reservation.user',
            'reservation.room.roomStatus',
            'reservation.room.typeRoom',
            'reservation.reservationStatus',
 
        ])->get();

        // Primero: obtener reservas vencidas
        $reservations = Reservation::where('fecha_fin', '<', now())
        ->whereHas('room') // aseguramos que tenga habitación
        ->get();

        $montosArray = Payments::pluck('monto','reservation_id')->toArray();
       

        return Inertia::render('admin/adminbilling', [
            'paymentPendiente'=>$paymentPendiente,
            'invoices' => $invoices, // todos los pagos con su reserva
            'users' => User::all(),
            'rooms' => Room::with(['roomStatus','typeRoom'])->get(),
            'roomStatuses' => RoomStatus::all(), 
            'typeRoom' => TypeRoom::all(),
            'reservations'=> Reservation::all(),
            'reservationStatus' => ReservationStatus::all(),
            'montosArray'=>$montosArray,
            'paymentConfirmadas' => $paymentConfirmadas,
            'paymentAnuladas'=> $paymentAnuladas,
            'pagination'=>$pagination,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'reservation_id' => 'required|integer|exists:reservation,id',
            'numero_factura' => 'required|string|max:20|unique:invoices,numero_factura',
            'fecha_emision' => 'required|date',
            'subtotal'      => 'required|numeric|min:0',
            'impuestos'     => 'required|numeric|min:0',
            'descuento'     => 'required|numeric|min:0',
            'total'         => 'required|numeric|min:0',
            'estado'        => 'required|in:emitida,pagada,anulada',
        ]);
        Invoices::create([
            'reservation_id' => $request->reservation_id,
            'numero_factura' => $request->numero_factura,
            'fecha_emision' => $request->fecha_emision,
            'subtotal' => $request->subtotal,
            'impuestos' => $request->impuestos,
            'descuento' => $request->descuento,
            'total' => $request->total,
            'estado' => $request->estado,
        ]);
        return redirect()->route('admin.adminbilling')->with('success', 'factura agregado');
    }
    public function update(Request $request, Invoices $invoice)
    {
        $request->validate([
            'estado' => ['required', 'in:emitida,pagada,anulada'],
        ]);

        $invoice->update([
            'estado' => $request->estado,
        ]);

        return redirect()->route('admin.adminbilling')
            ->with('success', 'Estado de la factura actualizado');
    }

}
