<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;

class RecipeController extends Controller
{
    private function normalizeIds($value): array
    {
        if (is_array($value)) return array_map('intval', $value);

        if (is_string($value) && trim($value) !== '') {
            return array_map('intval', array_filter(explode(',', $value), fn($v) => trim($v) !== ''));
        }

        return [];
    }

    private function applyDifficulties($query, array $difficulties)
    {
        return $query->whereIn('difficulty', $difficulties);
    }

    private function applyIngredientCategories($query, array $ingredientCategoryIds)
    {
        // inside belongsToIngredientsCategory relation, filtering by category id is correct
        return $query->whereIn('id', $ingredientCategoryIds);
    }

    private function applyIngredients($query, array $ingredientIds)
    {
        // inside belongsToIngredients relation, filtering by ingredient id is correct
        return $query->whereIn('id', $ingredientIds);
    }

    private function applyUtensils($query, array $utensilIds)
    {
        // inside belongsToUtensil relation, filtering by utensil id is correct
        return $query->whereIn('id', $utensilIds);
    }

    private function applyKeywordGlobal($query, ?string $keyword)
    {
        $keyword = is_string($keyword) ? trim($keyword) : null;
        if (!$keyword) return $query;

        // Postgres-friendly "ILIKE"
        $like = "%{$keyword}%";

        return $query->where(function ($q) use ($like) {
            // Recipe columns (adjust these to your actual columns)
            $q->orWhereHas('belongsToRecipeCategory', function ($qq) use ($like) {
                $qq->where('name', 'ILIKE', $like);
            })

                // Ingredient name (from recipe ingredients)
                ->orWhereHas('hasManyRecipeIngredient.belongsToIngredients', function ($qq) use ($like) {
                    $qq->where('name', 'ILIKE', $like);
                })

                // Seasoning ingredient name (if you want it included too)
                ->orWhereHas('hasManyRecipeSeasoning.belongsToIngredients', function ($qq) use ($like) {
                    $qq->where('name', 'ILIKE', $like);
                })

                // Ingredient category name
                ->orWhereHas('hasManyRecipeIngredient.belongsToIngredients.belongsToIngredientsCategory', function ($qq) use ($like) {
                    $qq->where('name', 'ILIKE', $like);
                })

                // Utensil name
                ->orWhereHas('hasManyUtensil.belongsToUtensil', function ($qq) use ($like) {
                    $qq->where('name', 'ILIKE', $like);
                });
        });
    }

    private function applyTimeFallback($query, ?int $requestedTime)
    {
        if (!$requestedTime) return $query;

        // If no results <= requestedTime, widen up to: 60, 120, 240, otherwise keep unbounded
        $thresholds = [$requestedTime, 60, 120, 240];

        foreach ($thresholds as $t) {
            $candidate = (clone $query)->where('time', '<=', $t);
            if ($candidate->exists()) {
                return $query->where('time', '<=', $t);
            }
        }

        return $query; // no time restriction if nothing matches even <= 240
    }

    public function getAll(Request $request)
    {
        $difficulties         = $request->input('difficulties', []);
        $ingredientCategories = $this->normalizeIds($request->input('ingredient_categories', []));
        $ingredients          = $this->normalizeIds($request->input('ingredients', []));
        $utensils             = $this->normalizeIds($request->input('utensils', []));
        $diet                 = $request->input('diet');
        $type                 = $request->input('type');
        $keyword              = $request->input('keyword');
        $time                 = $request->input('time');

        $recipes = Recipe::with([
            'hasManyRecipeIngredient.belongsToIngredients',
            'hasManyRecipeSeasoning.belongsToIngredients',
            'belongsToRecipeCategory',
            'hasManyUtensil.belongsToUtensil',
            'hasManyRecipeIngredient.belongsToIngredients.belongsToIngredientsCategory',
        ]);

        if ($type) {
            $recipes->whereHas('belongsToRecipeCategory', function ($q) use ($type) {
                $q->where('name', $type);
            });
        }

        if (!empty($difficulties)) {
            $recipes = $this->applyDifficulties($recipes, (array) $difficulties);
        }

        if (!empty($ingredientCategories)) {
            $recipes->whereHas(
                'hasManyRecipeIngredient.belongsToIngredients.belongsToIngredientsCategory',
                fn($q) => $this->applyIngredientCategories($q, $ingredientCategories)
            );
        }

        if (!empty($ingredients)) {
            $recipes->whereHas(
                'hasManyRecipeIngredient.belongsToIngredients',
                fn($q) => $this->applyIngredients($q, $ingredients)
            );
        }

        if (!empty($utensils)) {
            $recipes->whereHas(
                'hasManyUtensil.belongsToUtensil',
                fn($q) => $this->applyUtensils($q, $utensils)
            );
        }

        if (!empty($diet)) {
            $recipes->where('diet', $diet);
        }

        $recipes = $this->applyKeywordGlobal($recipes, $keyword);

        $recipes = $this->applyTimeFallback($recipes, is_numeric($time) ? (int) $time : null);

        return $recipes->get();
    }

    public function getDetails()
    {
        $recipe = Recipe::with([
            'hasManyRecipeIngredient.belongsToIngredients.belongsToIngredientsCategory',
            'hasManyRecipeSeasoning.belongsToIngredients.belongsToIngredientsCategory',
            "belongsToRecipeCategory",
            "hasManyUtensil.belongsToUtensil",
            "hasManySteps"
        ])->findOrFail(request('id'));

        $recipe->share_url = route('recipe.share', ['id' => $recipe->id]);

        return $recipe;
    }
}
