<?php

namespace App\Http\Controllers;

use App\Models\UserPreferences;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserPreferencesController extends Controller
{

    // join ingredients to string or null
    private function joinOrNull($value): ?string
    {
        if (is_array($value)) {
            $value = array_values(array_filter($value, fn ($v) => $v !== null && $v !== ''));
            return count($value) ? implode(',', $value) : null;
        }

        if (is_string($value)) {
            $trim = trim($value);
            return $trim === '' ? null : $trim;
        }

        return null;
    }

    // convert ingredients string to json or null
    private function ingredientToJsonOrNull($value): ?string
    {
        if ($value === null) return null;

        // If already array, store as JSON
        if (is_array($value)) {
            return empty($value) ? null : json_encode($value, JSON_UNESCAPED_UNICODE);
        }

        if (!is_string($value)) return null;

        $str = trim($value);
        if ($str === '') return null;

        // 1) Try as valid JSON first
        $decoded = json_decode($str, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            return empty($decoded) ? null : json_encode($decoded, JSON_UNESCAPED_UNICODE);
        }

        // 2) Best-effort convert JS-ish object literal to JSON
        $fixed = preg_replace('/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:/', '$1"$2":', $str);
        $fixed = preg_replace("/'([^'\\\\]*(?:\\\\.[^'\\\\]*)*)'/", '"$1"', $fixed);

        $decoded2 = json_decode($fixed, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            abort(422, 'ingredients must be a valid JSON array of objects (or convertible to one).');
        }

        return empty($decoded2) ? null : json_encode($decoded2, JSON_UNESCAPED_UNICODE);
    }

    // get last user saved randomized filter
    public function getPreferences(Request $request)
    {
        $user = Auth::user();
        return UserPreferences::where("id_user", "=", $user->id)->first();
    }

    // update last user saved randomized filter
    public function updatePreferences(Request $request)
    {
        $user = $request->user();

        // ✅ validate the ACTUAL incoming keys (plural)
        $data = $request->validate([
            'search_by' => ['sometimes', 'in:explore,saved'],
            'time'      => ['sometimes', 'integer', 'min:1', 'max:999'],
            'diet'      => ['sometimes', 'nullable', 'in:vegetarian,vegan'],

            // frontend sends arrays
            'difficulties'          => ['sometimes', 'array'],
            'ingredients'           => ['sometimes'],       // array OR string
            'ingredient_categories' => ['sometimes', 'array'],
            'utensils'              => ['sometimes', 'array'],
        ]);

        $payload = [];

        if (array_key_exists('search_by', $data)) $payload['search_by'] = $data['search_by'];
        if (array_key_exists('time', $data)) $payload['time'] = $data['time'];

        if (array_key_exists('diet', $data)) {
            $payload['diet'] = ($data['diet'] === '' ? null : $data['diet']);
        }

        if (array_key_exists('difficulties', $data)) {
            $payload['difficulty'] = $this->joinOrNull($data['difficulties']);
        }

        if (array_key_exists('ingredient_categories', $data)) {
            $payload['category'] = $this->joinOrNull($data['ingredient_categories']);
        }

        if (array_key_exists('utensils', $data)) {
            $payload['utensil'] = $this->joinOrNull($data['utensils']);
        }

        if (array_key_exists('ingredients', $data)) {
            $payload['ingredient'] = $this->ingredientToJsonOrNull($data['ingredients']);
        }

        $payload['search_by'] = $payload['search_by'] ?? 'explore';

        $preferences = UserPreferences::updateOrCreate(
            ['id_user' => $user->id],
            $payload
        );

        return response()->json([
            'message' => 'Preferences updated successfully',
            'preferences' => $preferences,
        ]);
    }
}
