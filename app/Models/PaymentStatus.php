<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentStatus extends Model
{
    use HasFactory;

    // Especificamos la tabla porque en la migración no está en plural
    protected $table = 'payment_status';

    protected $fillable = [
        'nombre',
        'descripcion',
    ];

    // Relación: un estado de pago puede tener muchas reservas
    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'payment_status_id');
    }
}
