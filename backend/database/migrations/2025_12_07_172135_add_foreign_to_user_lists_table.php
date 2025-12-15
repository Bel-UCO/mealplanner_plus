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
        Schema::table('user_lists', function (Blueprint $table) {
            $table->bigInteger('beverage')->nullable(false)->change();
            $table->bigInteger('snack_dessert')->nullable(false)->change();
            $table->foreign('beverage')->references('id')->on('recipes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_lists', function (Blueprint $table) {
            $table->dropForeign('beverage');
            $table->bigInteger('beverage')->nullable()->change();
            $table->bigInteger('snack_dessert')->nullable()->change();
        });
    }
};
