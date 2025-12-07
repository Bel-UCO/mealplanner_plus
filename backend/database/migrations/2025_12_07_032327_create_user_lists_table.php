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
            $table->id();
            $table->timestamps();
            $table->bigInteger('id_user');
            $table->foreign('id_user')->references('id')->on('users');
            $table->bigInteger('breakfast');
            $table->foreign('breakfast')->references('id')->on('recipes');
            $table->bigInteger('lunch');
            $table->foreign('lunch')->references('id')->on('recipes');
            $table->bigInteger('dinner');
            $table->foreign('dinner')->references('id')->on('recipes');
            $table->bigInteger('snack_dessert')->nullable();
            $table->foreign('snack_dessert')->references('id')->on('recipes');
            $table->bigInteger('beverage')->nullable();
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
