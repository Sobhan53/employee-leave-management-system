<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   
     public function up(): void
    {
        Schema::create('leave_requests', function (Blueprint $table) {
            $table->id();

            // Relationship
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // Leave details
            $table->enum('leave_type', ['vacation', 'sick', 'casual']);
            $table->date('start_date');
            $table->date('end_date');
            $table->text('reason');

            // Status (controlled values only)
            $table->enum('status', ['pending', 'approved', 'rejected'])
                  ->default('pending');

            // Manager feedback
            $table->text('manager_comment')->nullable();

            $table->timestamps();

            // Index for performance
            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leave_requests');
    }
};
