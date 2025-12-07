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
        Schema::create('recipe_seasonings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
            $table->uuid('id_recipe');
            $table->foreign('id_recipe')->references('id')->on('recipes');
            $table->uuid('id_ingredient')->nullable();
            $table->foreign('id_ingredient')->references('id')->on('ingredients');
            $table->string('seasoning_metadata');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recipe_seasonings');
    }
};
