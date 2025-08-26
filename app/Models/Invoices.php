<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

class Invoices extends Model
{
    use HasFactory;

    protected $table = 'invoices';

    protected $fillable = [
        'reservation_id',
        'numero_factura',
        'fecha_emision',
        'subtotal',
        'impuestos',
        'descuento',
        'total',
        'estado',
    ];

    /**
     * Relación con Reservation
     */
    public function reservation()
    {
        return $this->belongsTo(Reservation::class,'reservation_id');
    }
}
