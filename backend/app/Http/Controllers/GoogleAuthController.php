<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\UserPreferences;

class GoogleAuthController extends Controller
{
    public function redirect(Request $request)
    {
        if ($request->has('redirect_back')) {
            $request->session()->put('redirect_back', $request->query('redirect_back'));
        }

        return Socialite::driver('google')->redirect();
    }

    public function callback(Request $request)
    {
        $googleUser = Socialite::driver('google')->user();

        $user = User::updateOrCreate(
            ['google_id' => $googleUser->getId()],
            ['email'     => $googleUser->getEmail()]
        );

        $userPreferences = UserPreferences::firstOrCreate(
            ['id_user' => $user->id],       // kondisi existing
            [
                'search_by' => 'explore',   // nilai default saat dibuat
                'time'      => 30,
            ]
        );

        $token = $user->createToken('google_mobile')->plainTextToken;

        $redirectBack = $request->session()->pull(
            'redirect_back',
            'exp://127.0.0.1:19000' // fallback, not really used
        );

        $separator   = str_contains($redirectBack, '?') ? '&' : '?';
        $redirectUrl = $redirectBack . $separator . 'token=' . urlencode($token);

        return redirect()->away($redirectUrl);
    }
}
