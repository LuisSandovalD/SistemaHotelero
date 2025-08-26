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
        Schema::create('payment_status', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('descripcion')->nullable();
            $table->timestamps();
        });

        // Insert default payment statuses
        DB::table('payment_status')->insert([
            ['nombre' => 'Pendiente', 'descripcion' => 'Pago pendiente de confirmación'],
            ['nombre' => 'Confirmado', 'descripcion' => 'Pago confirmado'],
            ['nombre' => 'Fallido', 'descripcion' => 'Pago fallido'],
            ['nombre' => 'Reembolsado', 'descripcion' => 'Pago reembolsado'],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_status');
    }
};
