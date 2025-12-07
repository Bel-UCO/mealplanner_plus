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
        Schema::create('recipe_ingredients', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->bigInteger('id_recipe');
            $table->foreign('id_recipe')->references('id')->on('recipes');
            $table->bigInteger('id_ingredient');
            $table->foreign('id_ingredient')->references('id')->on('ingredients');
            $table->string('ingredient_metadata');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recipe_ingredients');
    }
};
