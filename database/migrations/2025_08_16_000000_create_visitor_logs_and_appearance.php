<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visitor_logs', function (Blueprint $table) {
            $table->id();
            $table->string('ip')->nullable();
            $table->string('path');
            $table->string('method')->default('GET');
            $table->string('user_agent')->nullable();
            $table->string('referer')->nullable();
            $table->string('country')->nullable();
            $table->string('device')->nullable(); // desktop, mobile, tablet
            $table->string('event')->default('page_view'); // page_view, cv_download
            $table->timestamps();
        });

        // Add cv_path to portfolio_profiles
        Schema::table('portfolio_profiles', function (Blueprint $table) {
            $table->string('cv_path')->nullable()->after('status');
        });

        // Add appearance columns to portfolio_settings
        Schema::table('portfolio_settings', function (Blueprint $table) {
            $table->string('font_heading')->default('Inter')->after('visible_sections');
            $table->string('font_body')->default('Inter')->after('font_heading');
            $table->string('color_scheme')->default('brutalist')->after('font_body');
            $table->string('animation_style')->default('reveal')->after('color_scheme');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visitor_logs');

        Schema::table('portfolio_profiles', function (Blueprint $table) {
            $table->dropColumn('cv_path');
        });

        Schema::table('portfolio_settings', function (Blueprint $table) {
            $table->dropColumn(['font_heading', 'font_body', 'color_scheme', 'animation_style']);
        });
    }
};
