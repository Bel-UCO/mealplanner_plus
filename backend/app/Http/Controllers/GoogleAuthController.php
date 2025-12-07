<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

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

        $token = $user->createToken('google_mobile')->plainTextToken;

        $redirectBack = $request->session()->pull(
            'redirect_back',
            'exp://127.0.0.1:19000' // fallback, not really used
        );

        $separator   = str_contains($redirectBack, '?') ? '&' : '?';
        $redirectUrl = $redirectBack . $separator . 'token=' . urlencode($token);

        \Log::info('Redirecting back to app with token', [
            'redirectUrl' => $redirectUrl,
        ]);

        return redirect()->away($redirectUrl);
    }
}
