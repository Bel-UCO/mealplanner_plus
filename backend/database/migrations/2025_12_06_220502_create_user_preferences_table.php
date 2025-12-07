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
        Schema::create('user_preferences', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
            $table->uuid('id_user');
            $table->foreign('id_user')->references('id')->on('users');
            $table->string('search_by')->check("search_by IN ('explore', 'saved')");
            $table->string('difficulty')->nullable();
            $table->integer('time');
            $table->string('diet')->check("diet IN ('vegetarian', 'vegan')")->nullable();
            $table->string('category')->nullable();
            $table->string('ingredient')->nullable();
            $table->string('utensil')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_preferences');
    }
};
