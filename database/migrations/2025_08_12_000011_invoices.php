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
        
        if (!Schema::hasTable('invoices')) {
            Schema::create('invoices', function (Blueprint $table) {
                $table->id();
                $table->foreignId('reservation_id')->constrained('reservation')->onDelete('cascade');
                $table->string('numero_factura')->unique();
                $table->date('fecha_emision');
                $table->decimal('subtotal', 10, 2);
                $table->decimal('impuestos', 10, 2)->default(0);
                $table->decimal('descuento', 10, 2)->default(0);
                $table->decimal('total', 10, 2);
                $table->enum('estado', ['emitida', 'pagada', 'anulada'])->default('emitida');
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
