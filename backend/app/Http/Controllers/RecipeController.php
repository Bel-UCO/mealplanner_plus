<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RecipeController extends Controller
{
    // convert id to array of integers from string
    private function normalizeIds($value): array
    {
        if (is_array($value)) return array_map('intval', $value);

        if (is_string($value) && trim($value) !== '') {
            return array_map(
                'intval',
                array_filter(explode(',', $value), fn($v) => trim($v) !== '')
            );
        }

        return [];
    }

    // recipe category type normalization
    private function normalizeStrings($value): array
    {
        if (is_array($value)) {
            return array_values(array_filter(array_map('trim', $value)));
        }

        if (is_string($value) && trim($value) !== '') {
            return array_values(array_filter(array_map('trim', explode(',', $value))));
        }

        return [];
    }

    // building query difficulty filters
    private function applyDifficulties($query, array $difficulties)
    {
        return $query->whereIn('difficulty', $difficulties);
    }

    // building query ingredient category filters
    private function applyIngredientCategories($query, array $ingredientCategoryIds)
    {
        return $query->whereIn('id', $ingredientCategoryIds);
    }

    // building query ingredient filters
    private function applyIngredients($query, array $ingredientIds)
    {
        return $query->whereIn('id', $ingredientIds);
    }

    // building query utensil filters
    private function applyUtensils($query, array $utensilIds)
    {
        return $query->whereIn('id', $utensilIds);
    }

    // keyword set
    private function applyKeywordGlobal($query, ?string $keyword)
    {
        $keyword = is_string($keyword) ? trim($keyword) : null;
        if (!$keyword) return $query;

        $like = "%{$keyword}%";

        return $query->where(function ($q) use ($like) {
            $q->orWhereHas(
                'belongsToRecipeCategory',
                fn($qq) =>
                $qq->where('name', 'ILIKE', $like)
            )
                ->orWhereHas(
                    'hasManyRecipeIngredient.belongsToIngredients',
                    fn($qq) =>
                    $qq->where('name', 'ILIKE', $like)
                )
                ->orWhereHas(
                    'hasManyRecipeSeasoning.belongsToIngredients',
                    fn($qq) =>
                    $qq->where('name', 'ILIKE', $like)
                )
                ->orWhereHas(
                    'hasManyRecipeIngredient.belongsToIngredients.belongsToIngredientsCategory',
                    fn($qq) => $qq->where('name', 'ILIKE', $like)
                )
                ->orWhereHas(
                    'hasManyUtensil.belongsToUtensil',
                    fn($qq) =>
                    $qq->where('name', 'ILIKE', $like)
                );
        });
    }

    // apply time filter with fallback mechanism
    private function applyTimeFallback($query, ?int $requestedTime)
    {
        if (!$requestedTime) return $query;

        $thresholds = [$requestedTime, 60, 120, 240];

        foreach ($thresholds as $t) {
            $candidate = (clone $query)->where('time', '<=', $t);
            if ($candidate->exists()) {
                return $query->where('time', '<=', $t);
            }
        }

        return $query;
    }

    // explore recipes with filter
    public function getAll(Request $request)
    {
        $difficulties         = (array) $request->input('difficulties', []);
        $ingredientCategories = $this->normalizeIds($request->input('ingredient_categories', []));
        $ingredients          = $this->normalizeIds($request->input('ingredients', []));
        $utensils             = $this->normalizeIds($request->input('utensils', []));
        $diet                 = $request->input('diet');
        $type                 = $this->normalizeStrings($request->input('type', []));
        $keyword              = $request->input('keyword');
        $time                 = $request->input('time');

        $user = Auth::user();

        $recipes = Recipe::with([
            'hasManyRecipeIngredient.belongsToIngredients',
            'hasManyRecipeSeasoning.belongsToIngredients',
            'belongsToRecipeCategory',
            'hasManyUtensil.belongsToUtensil',
            'hasManyRecipeIngredient.belongsToIngredients.belongsToIngredientsCategory',
        ])->withExists([
            'hasManyUserSavedRecipes as is_saved' => function ($q) use ($user) {
                $q->where('id_user', $user->id);
            }
        ]);

        if (!empty($type)) {
            $recipes->whereHas(
                'belongsToRecipeCategory',
                fn($q) =>
                $q->whereIn('name', $type)
            );
        }

        if (!empty($difficulties)) {
            $recipes = $this->applyDifficulties($recipes, $difficulties);
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

    // get one recipe details
    public function getDetails()
    {

        $user = Auth::user();

        $recipe = Recipe::with([
            'hasManyRecipeIngredient.belongsToIngredients.belongsToIngredientsCategory',
            'hasManyRecipeSeasoning.belongsToIngredients.belongsToIngredientsCategory',
            'belongsToRecipeCategory',
            'hasManyUtensil.belongsToUtensil',
            'hasManySteps'
        ])->withExists([
            'hasManyUserSavedRecipes as is_saved' => function ($q) use ($user) {
                $q->where('id_user', $user->id);
            }
        ])
            ->findOrFail(request('id'));

        return $recipe;
    }
}
