<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portfolio_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('tagline')->nullable();
            $table->text('bio')->nullable();
            $table->string('email')->nullable();
            $table->string('github')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('location')->nullable();
            $table->string('status')->default('Open to work');
            $table->timestamps();
        });

        Schema::create('portfolio_projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->text('long_description')->nullable();
            $table->json('tags')->nullable();
            $table->enum('status', ['completed', 'in-progress', 'planned'])->default('planned');
            $table->string('github')->nullable();
            $table->string('demo')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('portfolio_experiences', function (Blueprint $table) {
            $table->id();
            $table->string('company');
            $table->string('role');
            $table->string('duration');
            $table->text('description')->nullable();
            $table->enum('type', ['full-time', 'part-time', 'internship', 'contract'])->default('full-time');
            $table->json('technologies')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('portfolio_educations', function (Blueprint $table) {
            $table->id();
            $table->string('institution');
            $table->string('degree');
            $table->string('field');
            $table->string('duration');
            $table->string('gpa')->nullable();
            $table->json('highlights')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolio_educations');
        Schema::dropIfExists('portfolio_experiences');
        Schema::dropIfExists('portfolio_projects');
        Schema::dropIfExists('portfolio_profiles');
    }
};
