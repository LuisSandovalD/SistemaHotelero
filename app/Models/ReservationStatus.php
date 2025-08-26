<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReservationStatus extends Model
{
    use HasFactory;

    // Solo descomentar si la tabla no sigue la convención plural:
    protected $table = 'reservation_status';

    protected $fillable = [
        'nombre',
        'descripcion',
    ];

    // Relación inversa: un estado puede tener muchas reservas
    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'reservation_status_id');
    }
}
