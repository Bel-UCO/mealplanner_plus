<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RecipeShareController extends Controller
{
    public function show(Request $request)
    {
        $deepLink = $request->query('redirect');
        $fallback = "https://expo.dev/client";

        // Basic validation to prevent open redirects
        if (!$deepLink || !str_starts_with($deepLink, 'exp://')) {
            abort(400, 'Invalid redirect URL');
        }

        return view('deeplink', [
            'deepLink' => $deepLink,
            'fallback' => $fallback,
        ]);
    }
}
