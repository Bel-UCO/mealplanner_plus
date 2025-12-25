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
            return array_map(
                'intval',
                array_filter(explode(',', $value), fn($v) => trim($v) !== '')
            );
        }

        return [];
    }

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

    private function applyDifficulties($query, array $difficulties)
    {
        return $query->whereIn('difficulty', $difficulties);
    }

    private function applyIngredientCategories($query, array $ingredientCategoryIds)
    {
        return $query->whereIn('id', $ingredientCategoryIds);
    }

    private function applyIngredients($query, array $ingredientIds)
    {
        return $query->whereIn('id', $ingredientIds);
    }

    private function applyUtensils($query, array $utensilIds)
    {
        return $query->whereIn('id', $utensilIds);
    }

    private function applyKeywordGlobal($query, ?string $keyword)
    {
        $keyword = is_string($keyword) ? trim($keyword) : null;
        if (!$keyword) return $query;

        $like = "%{$keyword}%";

        return $query->whereHas('belongsToRecipe', function ($r) use ($like) {
            $r->where(function ($q) use ($like) {
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
        });
    }

    private function applyTimeFallback($query, ?int $requestedTime)
    {
        if (!$requestedTime) return $query;

        $thresholds = [$requestedTime, 60, 120, 240];

        foreach ($thresholds as $t) {
            $candidate = clone $query;
            $candidate->whereHas(
                'belongsToRecipe',
                fn($r) =>
                $r->where('time', '<=', $t)
            );

            if ($candidate->exists()) {
                return $query->whereHas(
                    'belongsToRecipe',
                    fn($r) =>
                    $r->where('time', '<=', $t)
                );
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
        $difficulties         = (array) $request->input('difficulties', []);
        $ingredientCategories = $this->normalizeIds($request->input('ingredient_categories', []));
        $ingredients          = $this->normalizeIds($request->input('ingredients', []));
        $utensils             = $this->normalizeIds($request->input('utensils', []));
        $diet                 = $request->input('diet');
        $type                 = $this->normalizeStrings($request->input('type', []));
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

        if (!empty($type)) {
            $saved->whereHas(
                'belongsToRecipe.belongsToRecipeCategory',
                fn($q) =>
                $q->whereIn('name', $type)
            );
        }

        if (!empty($difficulties)) {
            $saved->whereHas(
                'belongsToRecipe',
                fn($q) =>
                $this->applyDifficulties($q, $difficulties)
            );
        }

        if (!empty($ingredientCategories)) {
            $saved->whereHas(
                'belongsToRecipe.hasManyRecipeIngredient.belongsToIngredients.belongsToIngredientsCategory',
                fn($q) => $this->applyIngredientCategories($q, $ingredientCategories)
            );
        }

        if (!empty($ingredients)) {
            $saved->whereHas(
                'belongsToRecipe.hasManyRecipeIngredient.belongsToIngredients',
                fn($q) => $this->applyIngredients($q, $ingredients)
            );
        }

        if (!empty($utensils)) {
            $saved->whereHas(
                'belongsToRecipe.hasManyUtensil.belongsToUtensil',
                fn($q) => $this->applyUtensils($q, $utensils)
            );
        }

        if (!empty($diet)) {
            $saved->whereHas(
                'belongsToRecipe',
                fn($q) =>
                $q->where('diet', $diet)
            );
        }

        $saved = $this->applyKeywordGlobal($saved, $keyword);
        $saved = $this->applyTimeFallback($saved, is_numeric($time) ? (int) $time : null);

        return $saved;
    }

    public function userSaveRecipe(Request $request)
    {
        $user = Auth::user();
        $recipeId = intval(request("id"));

        $selected = UserSavedRecipe::where('id_user', $user->id)
            ->where('id_recipe', $recipeId)
            ->first();

        if (!$selected) {

            $newUserSavedRecipe = new UserSavedRecipe;

            $newUserSavedRecipe->id_user = $user->id;
            $newUserSavedRecipe->id_recipe = $recipeId;

            $newUserSavedRecipe->save();

            return $newUserSavedRecipe;
        
        } else {
            return UserSavedRecipe::where('id_user', $user->id)
                ->where('id_recipe', $recipeId)->delete();
        }
    }
}
