<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('portfolio_settings', function (Blueprint $table) {
            $table->string('site_title', 255)->nullable()->after('name_font_size');
            $table->string('favicon_path', 500)->nullable()->after('site_title');
        });
    }

    public function down(): void
    {
        Schema::table('portfolio_settings', function (Blueprint $table) {
            $table->dropColumn(['site_title', 'favicon_path']);
        });
    }
};
