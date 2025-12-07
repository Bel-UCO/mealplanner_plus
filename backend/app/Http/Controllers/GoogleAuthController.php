<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Google login failed',
                'message' => $e->getMessage()
            ], 400);
        }

        // Create or update user
        $user = User::updateOrCreate(
            ['email' => $googleUser->getEmail()],
            ['google_id' => $googleUser->getId()]
        );

        // Sanctum token
        $token = $user->createToken('google_login')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id'    => $user->id,
                'email' => $user->email,
            ]
        ]);
    }
}
