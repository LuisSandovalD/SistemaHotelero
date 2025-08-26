<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {

            $table->id();
            $table->integer('numero_habitacion');
            $table->integer('numero_piso');
            $table->decimal('precio_noche', 10, 2);
            $table->integer('capacidad');

            // FK hacia tipos de habitación
            $table->foreignId('type_rooms_id')
                ->constrained('type_rooms') 
                ->onDelete('cascade'); 

            // FK hacia estados de habitación
            $table->foreignId('room_status_id')
                ->constrained('room_status')
                ->onDelete('cascade');

            $table->timestamps();

        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
