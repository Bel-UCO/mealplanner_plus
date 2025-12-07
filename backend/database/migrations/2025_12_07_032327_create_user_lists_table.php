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
        Schema::create('user_lists', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
            $table->uuid('id_user');
            $table->foreign('id_user')->references('id')->on('users');
            $table->uuid('breakfast');
            $table->foreign('breakfast')->references('id')->on('recipes');
            $table->uuid('lunch');
            $table->foreign('lunch')->references('id')->on('recipes');
            $table->uuid('dinner');
            $table->foreign('dinner')->references('id')->on('recipes');
            $table->uuid('snack_dessert')->nullable();
            $table->foreign('snack_dessert')->references('id')->on('recipes');
            $table->uuid('beverage')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_lists');
    }
};
