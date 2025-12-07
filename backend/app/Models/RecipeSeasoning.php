<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecipeSeasoning extends Model
{
    use HasFactory;

    public function belongsToRecipe() {
        return $this->belongsTo(Recipe::class, 'id_recipe');
    }

    public function belongsToIngredients() {
        return $this->belongsTo(Ingredients::class, 'id_ingredient');
    }
}
