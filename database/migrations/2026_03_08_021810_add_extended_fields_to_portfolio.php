<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── Profile: more socials + editable text pieces ──
        Schema::table('portfolio_profiles', function (Blueprint $table) {
            $table->string('twitter')->nullable()->after('linkedin');
            $table->string('dribbble')->nullable()->after('twitter');
            $table->string('website')->nullable()->after('dribbble');
            $table->string('hero_subtitle')->nullable()->after('tagline');
            $table->string('contact_cta')->nullable()->after('status');
            $table->string('footer_text')->nullable()->after('contact_cta');
        });

        // ── Settings: element-level visibility toggles ──
        Schema::table('portfolio_settings', function (Blueprint $table) {
            $table->json('element_visibility')->nullable()->after('section_backgrounds');
        });
    }

    public function down(): void
    {
        Schema::table('portfolio_profiles', function (Blueprint $table) {
            $table->dropColumn(['twitter', 'dribbble', 'website', 'hero_subtitle', 'contact_cta', 'footer_text']);
        });

        Schema::table('portfolio_settings', function (Blueprint $table) {
            $table->dropColumn('element_visibility');
        });
    }
};
