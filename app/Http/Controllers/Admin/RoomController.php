<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Room;
use App\Models\TypeRoom;
use App\Models\RoomStatus;
use App\Models\Services;

class RoomController extends Controller
{
    /**
     * Mostrar listado de habitaciones con relaciones.
     */
    public function show()
    {
        $rooms = Room::with(['typeRoom', 'roomStatus', 'services'])->paginate(20);
        $type_rooms = TypeRoom::all();
        $room_status = RoomStatus::all();
        $room_service = Services::all();

        return Inertia::render('admin/adminrooms', [
            'rooms' => $rooms,
            'type_rooms' => $type_rooms,
            'room_status' => $room_status,
            'room_service' => $room_service,
        ]);
    }

    /**
     * Crear nueva habitación
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'numero_habitacion' => 'required|string|max:255|unique:rooms,numero_habitacion',
            'numero_piso'       => 'required|string|max:20',
            'precio_noche'      => 'required|numeric|min:0',
            'capacidad'         => 'required|integer|min:1',
            'type_rooms_id'     => 'required|exists:type_rooms,id',
            'room_status_id'    => 'required|exists:room_status,id',
            'room_service_id'   => 'nullable|array',
            'room_service_id.*' => 'exists:services,id',
        ]);

        $room = Room::create([
            'numero_habitacion' => $validated['numero_habitacion'],
            'numero_piso'       => $validated['numero_piso'],
            'precio_noche'      => $validated['precio_noche'],
            'capacidad'         => $validated['capacidad'],
            'type_rooms_id'     => $validated['type_rooms_id'],
            'room_status_id'    => $validated['room_status_id'],
        ]);

        if (!empty($validated['room_service_id'])) {
            $room->services()->sync($validated['room_service_id']);
        }

        return redirect()->route('admin.adminrooms')
            ->with('success', 'Habitación agregada correctamente');
    }

    /**
     * Actualizar habitación existente
     */
    public function update(Request $request, Room $room)
    {
        // Validación de los campos enviados (solo los que se modifican)
        $validated = $request->validate([
            'numero_habitacion' => 'sometimes|string|max:255|unique:rooms,numero_habitacion,' . $room->id,
            'numero_piso'       => 'sometimes|string|max:20',
            'precio_noche'      => 'sometimes|numeric|min:0',
            'capacidad'         => 'sometimes|integer|min:1',


            'type_rooms_id'     => 'sometimes|exists:type_rooms,id',
            'room_status_id'    => 'sometimes|exists:room_status,id',

            
            'room_service_id'   => 'sometimes|array',
            'room_service_id.*' => 'exists:services,id',
        ]);

        // Actualizamos solo los campos que llegaron
        $room->update($validated);

        // Sincronizamos la relación muchos a muchos con servicios
        $room->services()->sync($request->input('room_service_id', []));

        // Redirigimos con mensaje de éxito
        return redirect()->route('admin.adminrooms')
            ->with('success', 'Habitación actualizada correctamente');
    }


    /**
     * Eliminar habitación
     */
    public function destroy(Room $room)
    {
        $room->services()->detach();
        $room->delete();

       return redirect()->route('admin.adminrooms')
            ->with('success', 'Habitación eliminada correctamente');
    }
}
