<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Booking;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users');
            $table->string('email');
            $table->datetime('date');
            $table->unsignedBigInteger('origin_id');
            $table->unsignedBigInteger('destination_id');
            $table->integer('workers');
            $table->string('car_type')->nullable();
            $table->integer('duration');
            $table->decimal('amount');
            $table->text('observation')->nullable();
            $table->enum('status',Booking::STATUSES)->default('waiting_payment');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
