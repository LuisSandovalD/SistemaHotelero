<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Payments extends Model
{
    use HasFactory;

     protected $table = 'payments';
    protected $fillable = [
        'reservation_id',
        'payment_method_id',
        'payment_status_id',
        'monto',
        'fecha_pago',
        'referencia',
    ];

    // Un pago pertenece a una reservación
    public function reservation()
    {
        return $this->belongsTo(Reservation::class,'reservation_id');
    }

    // Un pago pertenece a un método de pago
    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class,'payment_method_id');
    }

    // Un pago pertenece a un estado de pago
    public function paymentStatus()
    {
        return $this->belongsTo(PaymentStatus::class,'payment_status_id');
    }
}
