<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserList extends Model
{
    use HasFactory;

    public function belongsToUser() {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function belongsToBreakfastRecipe() {
        return $this->belongsTo(Recipe::class, 'breakfast');
    }

    public function belongsToLunchRecipe() {
        return $this->belongsTo(Recipe::class, 'lunch');
    }

    public function belongsToDinnerRecipe() {
        return $this->belongsTo(Recipe::class, 'dinner');
    }

    public function belongsToSnackDessertRecipe() {
        return $this->belongsTo(Recipe::class, 'snack_dessert');
    }

    public function belongsToBeverageRecipe() {
        return $this->belongsTo(Recipe::class, 'beverage');
    }
}
