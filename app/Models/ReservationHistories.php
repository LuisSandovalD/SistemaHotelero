<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;


class ReservationHistories extends Model
{
    use HasFactory;

    protected $table = 'reservation_histories'; // <- explícito por si acaso

    protected $fillable = [
        'reservation_id',
        'user_id',
        'observacion',
    ];

    /**
     * Relación: un historial pertenece a una reserva
     */
    public function reservation()
    {
        return $this->belongsTo(Reservation::class, "reservation_id");
    }

    /**
     * Relación: un historial puede estar asociado a un usuario (quien hizo la acción)
     */
    public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }
}
