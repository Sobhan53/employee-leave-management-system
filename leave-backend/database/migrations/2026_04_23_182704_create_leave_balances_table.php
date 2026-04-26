<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
     public function up(): void
    {
        Schema::create('leave_balances', function (Blueprint $table) {
            $table->id();

            // Relationship
            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete()
                  ->unique();

            // Leave balances (no negative values allowed)
            $table->unsignedInteger('vacation_days')->default(20);
            $table->unsignedInteger('sick_days')->default(10);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leave_balances');
    }
};
