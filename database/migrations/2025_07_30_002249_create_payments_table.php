<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Payment;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->enum('method', Payment::METHODS); 
            $table->string('phone_number')->nullable();
            $table->string('transaction_id')->nullable();
            $table->enum('status', Payment::STATUSES); 
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
            $table->json('callback')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
