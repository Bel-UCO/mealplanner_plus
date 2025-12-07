<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IngredientsCategory extends Model
{
    use HasFactory;

    public function hasManyRecipeIngredient() {
        return $this->hasMany(RecipeIngredient::class, 'id_ingredient_category', 'id');
    }
}
