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
        Schema::create('payment_method', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('descripcion')->nullable();
            $table->timestamps();
        });

        // Insert default payment methods
        DB::table('payment_method')->insert([
            ['nombre' => 'Tarjeta de Crédito', 'descripcion' => 'Pago con tarjeta de crédito'],
            ['nombre' => 'PayPal', 'descripcion' => 'Pago a través de PayPal'],
            ['nombre' => 'Transferencia Bancaria', 'descripcion' => 'Pago mediante transferencia bancaria'],
            ['nombre' => 'Efectivo', 'descripcion' => 'Pago en efectivo al momento del check-in'],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_method');
    }
};
