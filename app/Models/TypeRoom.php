<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeRoom extends Model
{
    use HasFactory;

    protected $table = 'type_rooms';

    protected $fillable = [
        'nombre',
        'descripcion',
    ];

    public function rooms()
    {
        return $this->hasMany(Room::class, 'type_rooms_id');
    }
}
