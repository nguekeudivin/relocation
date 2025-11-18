<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    public function up(): void
    {
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('purpose')->nullable();
            $table->string('disk')->default('public');
            $table->string('path')->nullable();
            $table->text('url');
            $table->bigInteger('size_bytes')->nullable();
            $table->string('mime_type');
            $table->string('assetable_type');
            $table->unsignedBigInteger('assetable_id');
            $table->index(['assetable_type', 'assetable_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
