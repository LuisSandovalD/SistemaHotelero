<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
   use HasFactory;

    protected $table = 'reservation_histories';

    protected $fillable = [
        'reservation_id',
        'user_id',
        'observacion',
    ];

    /**
     * Relación con la reserva
     */
    public function reservation()
    {
        return $this->belongsTo(Reservation::class,'reservation_id');
    }

    /**
     * Relación con el usuario (quien registró la acción)
     */
    public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }
}
