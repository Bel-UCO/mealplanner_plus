<?php

namespace App\Http\Controllers;

use App\Models\UserSavedRecipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserSavedRecipeController extends Controller
{

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

    public function randomizeMealPlan(Request $request)
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

        $user = Auth::user();

        $breakfasts = UserSavedRecipe::with([
            'belongsToRecipe',
            'belongsToRecipe.hasManyRecipeIngredient.belongsToIngredients',
            'belongsToRecipe.hasManyRecipeSeasoning.belongsToIngredients',
            'belongsToRecipe.belongsToRecipeCategory',
            'belongsToRecipe.hasManyUtensil.belongsToUtensil',
            'belongsToRecipe.hasManyRecipeIngredient.belongsToIngredients.belongsToIngredientsCategory',
        ])->where("id_user", $user->id)
            ->whereHas('belongsToRecipe.belongsToRecipeCategory', function ($q) {
                $q->where('name', request('type'));
            });

        if (!empty($difficulties)) {
            $breakfasts = $breakfasts->whereHas(
                'belongsToRecipe',
                function ($q) use ($difficulties) {
                    $q = $this->buildQueryDifficulties($q, $difficulties);
                }
            );
        }


        if (!empty($ingredientCategories)) {
            $breakfasts = $breakfasts->whereHas(
                'belongsToRecipe.hasManyRecipeIngredient.belongsToIngredients.belongsToIngredientsCategory',
                function ($q) use ($ingredientCategories) {
                    $q = $this->buildQueryIngredientCategory($q, $ingredientCategories);
                }
            );
        }

        if (!empty($ingredients)) {
            $breakfasts = $breakfasts->whereHas(
                'belongsToRecipe.hasManyRecipeIngredient.belongsToIngredients',
                function ($q) use ($ingredients) {
                    $q = $this->buildQueryIngredient($q, $ingredients);
                }
            );
        }

        if (!empty($utensils)) {
            $breakfasts = $breakfasts->whereHas(
                'belongsToRecipe.hasManyUtensil.belongsToUtensil',
                function ($q) use ($utensils) {
                    $q = $this->buildQueryUtensil($q, $utensils);
                }
            );
        }

        if (!empty($diet)) {
            $breakfasts = $breakfasts->whereHas(
                'belongsToRecipe',
                function ($q) use ($diet) {
                    $q = $q->where("diet", $diet);
                }
            );
        }

        $time = request("time");

        $breakfasts = $breakfasts->whereHas(
            'belongsToRecipe',
            function ($q) use ($time) {
                $queryHalfHour = clone $q;

                if ($queryHalfHour->where("time", "<=", $time)->count() == 0) {
                    $queryOneHour = clone $q;
                    if ($queryOneHour->where("time", "<=", 60)->count() == 0) {
                        $queryTwoHour = clone $q;
                        if ($queryTwoHour->where("time", "<=", 120)->count() == 0) {
                            $queryFourHour = clone $q;
                            if ($queryFourHour->where("time", "<=", 240)->count() == 0) {
                                $q = $q;
                            } else {
                                $q = $q->where("time", "<=", 240);
                            }
                        } else {
                            $q = $q->where("time", "<=", 120);
                        }
                    } else {
                        $q = $q->where("time", "<=", 60);
                    }
                } else {
                    $q = $q->where("time", "<=", $time);
                }
            }
        );

        return $breakfasts->paginate(10);
    }

    public function userSaveRecipe()
    {
        $user = Auth::user();


        $selectedUserRecipe = UserSavedRecipe::where("id_user", $user->id)->where("id_recipe", request("id"))->first();

        if ($selectedUserRecipe == null) {
            $userSavedRecipe = new UserSavedRecipe;
            $userSavedRecipe->id_user = $user->id;
            $userSavedRecipe->id_recipe = request("id");
            $userSavedRecipe->save();
        } else {
            $selectedUserRecipe->delete();
        }
    }
}
