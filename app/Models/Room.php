<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $table = 'rooms';

    protected $fillable = [
        'numero_habitacion',
        'numero_piso',
        'precio_noche',
        'capacidad',
        'type_rooms_id',
        'room_status_id',
    ];

    protected $casts = [
        'numero_habitacion' => 'integer',
        'numero_piso'       => 'integer',
        'precio_noche'      => 'decimal:2',
        'capacidad'         => 'integer',
        'type_rooms_id'     => 'integer',
        'room_status_id'    => 'integer',
    ];

    public function typeRoom()
    {
        return $this->belongsTo(TypeRoom::class, 'type_rooms_id');
    }

    public function roomStatus()
    {
        return $this->belongsTo(RoomStatus::class, 'room_status_id');
    }

    public function services()
    {
        return $this->belongsToMany(Services::class, 'room_service', 'room_id', 'service_id');
    }
}
