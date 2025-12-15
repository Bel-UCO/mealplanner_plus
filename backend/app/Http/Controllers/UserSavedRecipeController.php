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
        if (!empty($ingredientCategories)) {

            $query = $query->whereIn('id', $ingredientCategories);
        }

        return $query->orWhere("name", "ILIKE", "%" . request("keyword") . "%");
    }

    public function buildQueryIngredient($query, $ingredients)
    {
        if (!empty($ingredients)) {

            $query = $query->whereIn('id', $ingredients);
        }

        return $query->orWhere("name", "ILIKE", "%" . request("keyword") . "%");
    }

    public function buildQueryUtensil($query, $utensils)
    {
        if (!empty($utensils)) {

            $query = $query->whereIn('id', $utensils);
        }

        return $query->orWhere("name", "ILIKE", "%" . request("keyword") . "%");
    }

    public function getList(Request $request)
    {
        return $this->queryUserSavedRecipe($request)->paginate(10);
    }

    public function queryUserSavedRecipe(Request $request)
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

        $breakfasts = $breakfasts->whereHas(
            'belongsToRecipe.hasManyRecipeIngredient.belongsToIngredients.belongsToIngredientsCategory',
            function ($q) use ($ingredientCategories) {
                $q = $this->buildQueryIngredientCategory($q, $ingredientCategories);
            }
        );

        $breakfasts = $breakfasts->whereHas(
            'belongsToRecipe.hasManyRecipeIngredient.belongsToIngredients',
            function ($q) use ($ingredients) {
                $q = $this->buildQueryIngredient($q, $ingredients);
            }
        );

        $breakfasts = $breakfasts->whereHas(
            'belongsToRecipe.hasManyUtensil.belongsToUtensil',
            function ($q) use ($utensils) {
                $q = $this->buildQueryUtensil($q, $utensils);
            }
        );

        if (!empty($diet)) {
            $breakfasts = $breakfasts->whereHas(
                'belongsToRecipe',
                function ($q) use ($diet) {
                    $q = $q->where("diet", $diet);
                }
            );
        }

        $time = request('time');

        if (!empty($time)) {
            $time = (int) $time;

            // fallback levels
            $levels = [$time, 60, 120, 240];

            $selectedTime = null;

            foreach ($levels as $t) {
                $check = clone $breakfasts;
                $check->whereHas('belongsToRecipe', function ($q) use ($t) {
                    $q->where('time', '<=', $t);
                });

                if ($check->exists()) {
                    $selectedTime = $t;
                    break;
                }
            }

            if ($selectedTime !== null) {
                $breakfasts->whereHas('belongsToRecipe', function ($q) use ($selectedTime) {
                    $q->where('time', '<=', $selectedTime);
                });
            }
        }


        return $breakfasts;
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
