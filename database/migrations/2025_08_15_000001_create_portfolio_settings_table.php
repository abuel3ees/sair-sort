<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portfolio_settings', function (Blueprint $table) {
            $table->id();
            $table->json('section_order')->nullable(); // ["hero","projects","experience","education","contact"]
            $table->json('visible_sections')->nullable(); // ["hero","projects","experience","education","contact"]
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolio_settings');
    }
};
