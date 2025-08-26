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
        if (!Schema::hasTable('payments')) {
            Schema::create('payments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('reservation_id')->constrained('reservation')->onDelete('cascade');
                $table->foreignId('payment_method_id')->constrained('payment_method')->onDelete('cascade');
                $table->foreignId('payment_status_id')->constrained('payment_status')->onDelete('cascade');
                $table->decimal('monto', 10, 2);
                $table->dateTime('fecha_pago');
                $table->string('referencia')->nullable();
                $table->timestamps();
            });
        }


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
