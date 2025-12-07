<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Recipe;

class RandomizerController extends Controller
{
    public function randomizeMealPlan(Request $request) {
        $difficulties = request('difficulties');
        $time = request('time');
        $diet = request('diet');
        $categories = request('categories');
        $ingredients = request('ingredients');
        $utensils = request('utensils');

        $breakfasts = Recipe::where('recipe_category', 'breakfast')
        ->with(['hasManyRecipeIngredient.belongsToIngredients',
        'hasManyRecipeSeasoning.belongsToIngredients',
        "belongsToRecipeCategory",
        "hasManyUtensil.belongsToUtensil"]);


        // $breakfast = Recipe::where('recipe_category', 'breakfast')
        //     ->where(, $difficulties)
        //     ->where('preparation_time', '<=', $time)
        //     ->where('diet', $diet)
        //     ->where('category', $categories)
        //     ->inRandomOrder()
        //     ->first();
    }
}
