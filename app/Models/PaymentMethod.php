<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use HasFactory;

    // Como la tabla es singular en tu migración, lo indicamos
    protected $table = 'payment_method';

    protected $fillable = [
        'nombre',
        'descripcion',
    ];

    // Relación: un método de pago puede tener muchas reservas
    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'payment_method_id');
    }
}
