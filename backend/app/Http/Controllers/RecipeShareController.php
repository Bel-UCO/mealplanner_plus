<?php

namespace App\Http\Controllers;

use App\Models\Recipe;

class RecipeShareController extends Controller
{
    public function show($id)
    {
        $recipe = Recipe::with([
            'hasManyRecipeIngredient.belongsToIngredients',
            'hasManyRecipeSeasoning.belongsToIngredients',
            'belongsToRecipeCategory',
            'hasManyUtensil.belongsToUtensil',
            'hasManyRecipeIngredient.belongsToIngredients.belongsToIngredientsCategory',
            'hasManySteps',
        ])->findOrFail($id);

        // 🔴 PENTING: scheme HARUS sama dengan app.json Expo
        $deepLink = "mealplanner://recipe/" . $recipe->id;

        return view('share-recipe', compact('recipe', 'deepLink'));
    }
}
