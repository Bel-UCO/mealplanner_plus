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

    public function hasManyUserListAsBreakfast() {
        return $this->hasMany(UserList::class, 'breakfast', 'id');
    }

    public function hasManyUserListAsLunch() {
        return $this->hasMany(UserList::class, 'lunch', 'id');
    }

    public function hasManyUserListAsDinner() {
        return $this->hasMany(UserList::class, 'dinner', 'id');
    }

    public function hasManyUserListAsSnackDessert() {
        return $this->hasMany(UserList::class, 'snack_dessert', 'id');
    }

    public function hasManyUserListAsBeverage() {
        return $this->hasMany(UserList::class, 'beverage', 'id');
    }

    public function hasManyUserSavedRecipes() {
        return $this->hasMany(UserSavedRecipe::class, 'id_recipe', 'id');
    }
}
