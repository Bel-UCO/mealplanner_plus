<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserPreferencesController extends Controller
{
    public function getPreferences(Request $request)
    {
        $preferences = $request->user()->preferences;
        return $preferences;
    }

    public function updatePreferences(Request $request)
    {
        $user = $request->user();
        $preferences = $user->preferences;

        $preferences->update($request->only([
            'search_by',
            'difficulty',
            'time',
            'diet',
            'category',
            'ingredient',
            'utensil'
        ]));

        return response()->json(['message' => 'Preferences updated successfully', 'preferences' => $preferences]);
    }
}
