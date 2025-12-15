<?php

namespace App\Http\Controllers;

use App\Models\UserSavedRecipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserSavedRecipeController extends Controller
{
    private function normalizeIds($value): array
    {
        if (is_array($value)) return array_map('intval', $value);

        if (is_string($value) && trim($value) !== '') {
            return array_map('intval', array_filter(explode(',', $value), fn ($v) => trim($v) !== ''));
        }

        return [];
    }

    private function applyDifficulties($query, array $difficulties)
    {
        // This is inside belongsToRecipe query
        return $query->whereIn('difficulty', $difficulties);
    }

    private function applyIngredientCategories($query, array $ingredientCategoryIds)
    {
        // This is inside belongsToIngredientsCategory query
        return $query->whereIn('id', $ingredientCategoryIds);
    }

    private function applyIngredients($query, array $ingredientIds)
    {
        // This is inside belongsToIngredients query
        return $query->whereIn('id', $ingredientIds);
    }

    private function applyUtensils($query, array $utensilIds)
    {
        // This is inside belongsToUtensil query
        return $query->whereIn('id', $utensilIds);
    }

    /**
     * Global keyword search across Recipe + related models,
     * but applied from UserSavedRecipe using whereHas('belongsToRecipe', ...)
     */
    private function applyKeywordGlobal($query, ?string $keyword)
    {
        $keyword = is_string($keyword) ? trim($keyword) : null;
        if (!$keyword) return $query;

        $like = "%{$keyword}%";

        return $query->whereHas('belongsToRecipe', function ($r) use ($like) {
            $r->where(function ($q) use ($like) {
                $q->orWhereHas('belongsToRecipeCategory', function ($qq) use ($like) {
                      $qq->where('name', 'ILIKE', $like);
                  })

                  ->orWhereHas('hasManyRecipeIngredient.belongsToIngredients', function ($qq) use ($like) {
                      $qq->where('name', 'ILIKE', $like);
                  })

                  ->orWhereHas('hasManyRecipeSeasoning.belongsToIngredients', function ($qq) use ($like) {
                      $qq->where('name', 'ILIKE', $like);
                  })

                  ->orWhereHas('hasManyRecipeIngredient.belongsToIngredients.belongsToIngredientsCategory', function ($qq) use ($like) {
                      $qq->where('name', 'ILIKE', $like);
                  })

                  ->orWhereHas('hasManyUtensil.belongsToUtensil', function ($qq) use ($like) {
                      $qq->where('name', 'ILIKE', $like);
                  });
            });
        });
    }

    private function applyTimeFallback($query, ?int $requestedTime)
    {
        if (!$requestedTime) return $query;

        $thresholds = [$requestedTime, 60, 120, 240];

        foreach ($thresholds as $t) {
            $candidate = clone $query;
            $candidate->whereHas('belongsToRecipe', function ($r) use ($t) {
                $r->where('time', '<=', $t);
            });

            if ($candidate->exists()) {
                return $query->whereHas('belongsToRecipe', function ($r) use ($t) {
                    $r->where('time', '<=', $t);
                });
            }
        }

        return $query;
    }

    public function getList(Request $request)
    {
        return $this->queryUserSavedRecipe($request)->paginate(10);
    }

    public function queryUserSavedRecipe(Request $request)
    {
        $difficulties         = $request->input('difficulties', []);
        $ingredientCategories = $this->normalizeIds($request->input('ingredient_categories', []));
        $ingredients          = $this->normalizeIds($request->input('ingredients', []));
        $utensils             = $this->normalizeIds($request->input('utensils', []));
        $diet                 = $request->input('diet');
        $type                 = $request->input('type');
        $keyword              = $request->input('keyword');
        $time                 = $request->input('time');

        $user = Auth::user();

        $saved = UserSavedRecipe::with([
            'belongsToRecipe',
            'belongsToRecipe.hasManyRecipeIngredient.belongsToIngredients',
            'belongsToRecipe.hasManyRecipeSeasoning.belongsToIngredients',
            'belongsToRecipe.belongsToRecipeCategory',
            'belongsToRecipe.hasManyUtensil.belongsToUtensil',
            'belongsToRecipe.hasManyRecipeIngredient.belongsToIngredients.belongsToIngredientsCategory',
        ])->where('id_user', $user->id);

        if ($type) {
            $saved->whereHas('belongsToRecipe.belongsToRecipeCategory', function ($q) use ($type) {
                $q->where('name', $type);
            });
        }

        if (!empty($difficulties)) {
            $saved->whereHas('belongsToRecipe', function ($q) use ($difficulties) {
                $this->applyDifficulties($q, (array) $difficulties);
            });
        }

        if (!empty($ingredientCategories)) {
            $saved->whereHas(
                'belongsToRecipe.hasManyRecipeIngredient.belongsToIngredients.belongsToIngredientsCategory',
                fn ($q) => $this->applyIngredientCategories($q, $ingredientCategories)
            );
        }

        if (!empty($ingredients)) {
            $saved->whereHas(
                'belongsToRecipe.hasManyRecipeIngredient.belongsToIngredients',
                fn ($q) => $this->applyIngredients($q, $ingredients)
            );
        }

        if (!empty($utensils)) {
            $saved->whereHas(
                'belongsToRecipe.hasManyUtensil.belongsToUtensil',
                fn ($q) => $this->applyUtensils($q, $utensils)
            );
        }

        if (!empty($diet)) {
            $saved->whereHas('belongsToRecipe', function ($q) use ($diet) {
                $q->where('diet', $diet);
            });
        }

        // ✅ GLOBAL keyword filter
        $saved = $this->applyKeywordGlobal($saved, $keyword);

        // ✅ Time fallback (applies to recipe.time)
        $saved = $this->applyTimeFallback($saved, is_numeric($time) ? (int) $time : null);

        return $saved;
    }

    public function userSaveRecipe(Request $request)
    {
        $user = Auth::user();
        $recipeId = $request->input('id');

        $selected = UserSavedRecipe::where('id_user', $user->id)
            ->where('id_recipe', $recipeId)
            ->first();

        if ($selected === null) {
            $userSavedRecipe = new UserSavedRecipe;
            $userSavedRecipe->id_user = $user->id;
            $userSavedRecipe->id_recipe = $recipeId;
            $userSavedRecipe->save();
        } else {
            $selected->delete();
        }
    }
}
