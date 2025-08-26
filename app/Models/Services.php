<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Services extends Model
{
    use HasFactory;
    // Solo definir si la tabla no sigue la convención
    protected $table = 'services';

    protected $fillable = [
        'nombre',
        'descripcion',
    ];

     public function rooms()
    {
        return $this->belongsToMany(Room::class, 'room_service', 'service_id', 'room_id');
    }
}
