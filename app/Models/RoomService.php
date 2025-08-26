<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomService extends Model
{
    use HasFactory;

    // Solo define si la tabla no sigue la convención
    protected $table = 'room_service';

    protected $fillable = [
        'room_id',
        'service_id',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class, 'room_id');
    }

    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id');
    }
}
