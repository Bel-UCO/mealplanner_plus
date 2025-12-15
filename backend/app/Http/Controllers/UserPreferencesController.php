<?php

namespace App\Http\Controllers;

use App\Models\UserPreferences;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserPreferencesController extends Controller
{
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
    public function getPreferences(Request $request)
    {

        $user = Auth::user();
        $userPreference = UserPreferences::where("id_user","=",$user->id)->first();

        return $userPreference;
    }

    public function updatePreferences(Request $request)
    {
        $user = $request->user();
        $preferences = $user->hasUserPreference;

        $data = $request->validate([
            'search_by' => ['sometimes', 'in:explore,saved'],
            'difficulty' => ['sometimes'], // can be array or string
            'time' => ['sometimes', 'integer', 'min:1', 'max:999'],
            'diet' => ['sometimes', 'nullable', 'in:vegetarian,vegan'],
            'category' => ['sometimes'],
            'ingredient' => ['sometimes'],
            'utensil' => ['sometimes'],
        ]);

        $payload = [];

        if (array_key_exists('search_by', $data)) $payload['search_by'] = $data['search_by'];
        if (array_key_exists('time', $data)) $payload['time'] = $data['time'];

        if (array_key_exists('diet', $data)) {
            // allow "" from frontend to become null
            $payload['diet'] = ($data['diet'] === '' ? null : $data['diet']);
        }

        if (array_key_exists('difficulty', $data)) $payload['difficulty'] = $this->joinOrNull($data['difficulty']);
        if (array_key_exists('category', $data)) $payload['category'] = $this->joinOrNull($data['category']);
        if (array_key_exists('ingredient', $data)) $payload['ingredient'] = $this->joinOrNull($data['ingredient']);
        if (array_key_exists('utensil', $data)) $payload['utensil'] = $this->joinOrNull($data['utensil']);

        // Keep your existing update pattern
        $preferences->update($payload);

        return response()->json(['message' => 'Preferences updated successfully', 'preferences' => $preferences]);
    }
}
