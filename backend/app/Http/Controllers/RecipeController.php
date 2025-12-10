<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;

class RecipeController extends Controller
{
    //

    public function buildQueryDifficulties($query, $difficulties)
    {
        return $query->whereIn('difficulty', $difficulties);
    }

    public function buildQueryIngredientCategory($query, $ingredientCategories)
    {
        return $query->whereIn('id', $ingredientCategories);
    }

    public function buildQueryIngredient($query, $ingredients)
    {
        return $query->whereIn('id', $ingredients);
    }

    public function buildQueryUtensil($query, $utensils)
    {
        return $query->whereIn('id', $utensils);
    }

    public function getAll(Request $request)
    {
        $difficulties = $request->input('difficulties', []);
        $ingredients  = $request->input('ingredients', []);
        $ingredientCategories = $request->input('ingredient_categories', []);
        $utensils     = $request->input('utensils', []);
        $diet = request("diet");
        
        if (is_string($ingredientCategories)) {
            $ingredientCategories = array_map('intval', explode(',', $ingredientCategories));
        }

        if (is_string($ingredients)) {
            $ingredients = array_map('intval', explode(',', $ingredients));
        }

        if (is_string($utensils)) {
            $utensils = array_map('intval', explode(',', $utensils));
        }

        $breakfasts = Recipe::with([
            'hasManyRecipeIngredient.belongsToIngredients',
            'hasManyRecipeSeasoning.belongsToIngredients',
            'belongsToRecipeCategory',
            'hasManyUtensil.belongsToUtensil',
            'hasManyRecipeIngredient.belongsToIngredients.belongsToIngredientsCategory',
        ])
            ->whereHas('belongsToRecipeCategory', function ($q) {
                $q->where('name', request('type'));
            });

        if (!empty($difficulties)) {
            $breakfasts = $this->buildQueryDifficulties($breakfasts, $difficulties);
        }

        if (!empty($ingredientCategories)) {
            $breakfasts = $breakfasts->whereHas(
                'hasManyRecipeIngredient.belongsToIngredients.belongsToIngredientsCategory',
                function ($q) use ($ingredientCategories) {
                    $this->buildQueryIngredientCategory($q, $ingredientCategories);
                }
            );
        }

        if (!empty($ingredients)) {
            $breakfasts = $breakfasts->whereHas(
                'hasManyRecipeIngredient.belongsToIngredients',
                function ($q) use ($ingredients) {
                    $this->buildQueryIngredient($q, $ingredients);
                }
            );
        }

        if (!empty($utensils)) {
            $breakfasts = $breakfasts->whereHas(
                'hasManyUtensil.belongsToUtensil',
                function ($q) use ($utensils) {
                    $this->buildQueryUtensil($q, $utensils);
                }
            );
        }

        if (!empty($diet)) {
            $breakfasts = $breakfasts->where("diet", $diet);
        }

        $queryHalfHour = clone $breakfasts;

        if ($queryHalfHour->where("time", "<=", request("time"))->count() == 0) {
            $queryOneHour = clone $breakfasts;
            if ($queryOneHour->where("time", "<=", 60)->count() == 0) {
                $queryTwoHour = clone $breakfasts;
                if ($queryTwoHour->where("time", "<=", 120)->count() == 0) {
                    $queryFourHour = clone $breakfasts;
                    if ($queryFourHour->where("time", "<=", 240)->count() == 0) {

                        $breakfasts = $breakfasts;

                    } else {
                        $breakfasts = $breakfasts->where("time", "<=", 240);
                    }
                } else {
                    $breakfasts = $breakfasts->where("time", "<=", 120);
                }
            } else {
                $breakfasts = $breakfasts->where("time", "<=", 60);
            }
        } else {
            $breakfasts = $breakfasts->where("time", "<=", request("time"));
        }

        return $breakfasts->get();
    }

    public function getDetails(){
        $recipe = Recipe::with(['hasManyRecipeIngredient.belongsToIngredients.belongsToIngredientsCategory',
        'hasManyRecipeSeasoning.belongsToIngredients.belongsToIngredientsCategory',
        "belongsToRecipeCategory",
        "hasManyUtensil.belongsToUtensil",
        "hasManySteps"])->findOrFail(request('id'));

        return $recipe;
    }
}
