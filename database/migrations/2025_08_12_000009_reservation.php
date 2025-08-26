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
        Schema::create('reservation', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->foreignId('room_id')
                ->constrained('rooms')
                ->onDelete('cascade');

            $table->date('fecha_inicio');
            $table->date('fecha_fin');
            $table->integer('adultos');
            $table->integer('ninos')->default(0);

            $table->foreignId('reservation_status_id')
                ->constrained('reservation_status')
                ->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservation');
    }
};
