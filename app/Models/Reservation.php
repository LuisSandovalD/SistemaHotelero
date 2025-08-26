<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    // Solo si la tabla es singular en la migración:
    protected $table = 'reservation';

    protected $fillable = [
        'user_id',
        'room_id',
        'fecha_inicio',
        'fecha_fin',
        'adultos',
        'ninos',
        'reservation_status_id',
    ];

    // Relaciones
    public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }

    public function room()
    {
        return $this->belongsTo(Room::class,'room_id');
    }

    public function reservationStatus()
    {
        return $this->belongsTo(ReservationStatus::class, 'reservation_status_id');
    }
    public function invoice()
    {
        return $this->hasOne(Invoice::class);
    }
        // Relación: la reserva puede tener varios pagos
     public function payments()
    {
        return $this->hasMany(Payments::class, 'reservation_id');
    }

    // Relación: historial de cambios de la reserva
    public function histories()
    {
        return $this->hasMany(ReservationHistory::class, 'reservation_id');
    }

}
