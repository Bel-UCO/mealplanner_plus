<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ingredients extends Model
{
    use HasFactory;

    public function hasManyRecipeIngredient() {
        return $this->hasMany(RecipeIngredient::class, 'id_ingredient', 'id');
    }

    public function belongsToIngredientsCategory() {
        return $this->belongsTo(IngredientsCategory::class, 'id_ingredient_category');
    }

    public function hasManyRecipeSeasoning() {
        return $this->hasMany(RecipeSeasoning::class, 'id_ingredient', 'id');
    }
}
