<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('recipes', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name');
            $table->string('image');
            $table->string('diet')->check("diet IN ('vegetarian', 'vegan')")->nullable();
            $table->bigInteger('id_recipe_category');
            $table->foreign('id_recipe_category')->references('id')->on('recipe_categories');
            $table->integer('difficulty');
            $table->integer('time');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recipes');
    }
};
