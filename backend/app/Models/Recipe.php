<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    use HasFactory;

    public function hasManyRecipeIngredient() {
        return $this->hasMany(RecipeIngredient::class, 'id_recipe', "id");
    }

    public function hasManyRecipeSeasoning() {
        return $this->hasMany(RecipeSeasoning::class, 'id_recipe', 'id');
    }

    public function belongsToRecipeCategory() {
        return $this->belongsTo(RecipeCategory::class, 'id_recipe_category');
    }

    public function hasManyUtensil() {
        return $this->hasMany(RecipeUtensil::class, 'id_recipe', 'id');
    }

    public function hasManySteps() {
        return $this->hasMany(Steps::class, 'id_recipe', 'id');
    }

}
