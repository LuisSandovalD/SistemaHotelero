<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservation_status', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('descripcion')->nullable();
            $table->timestamps();
        });

       DB::table('reservation_status')->insert([
           ['nombre' => 'Pendiente', 'descripcion' => 'Reserva pendiente de confirmación'],
           ['nombre' => 'Confirmada', 'descripcion' => 'Reserva confirmada'],
           ['nombre' => 'Cancelada', 'descripcion' => 'Reserva cancelada'],
           ['nombre' => 'Finalizada', 'descripcion' => 'Reserva finalizada'],
       ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservation_status');
    }
};
