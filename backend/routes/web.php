<?php

use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\RandomizerController;
use App\Models\Recipe;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RecipeController;
use App\Models\UserPreferences;
use App\Http\Controllers\UserPreferencesController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);

Route::get('/auth/google/mobile-done', function () {
    return '<html><body><h1>You can close this window</h1></body></html>';
});

Route::get('/', function () {
    return view('welcome');
});

Route::get('/recipe-detail/{id}', [RecipeController::class, 'getDetails']);
Route::middleware('auth:sanctum')->get('/randomize', [RandomizerController::class, 'randomizeMealPlan']);
Route::middleware('auth:sanctum')->get('/get-preferences', [UserPreferencesController::class, 'getPreferences']);
Route::middleware('auth:sanctum')->post('/set-preferences', [UserPreferencesController::class, 'updatePreferences']);
