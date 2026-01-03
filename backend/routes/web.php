<?php

use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\IngredientsController;
use App\Http\Controllers\RandomizerController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserPreferencesController;
use App\Http\Controllers\UserSavedRecipeController;
use App\Http\Controllers\RecipeShareController;

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

Route::middleware('auth:sanctum')->get('/recipe', [RecipeController::class, 'getAll']);
Route::middleware('auth:sanctum')->get('/ingredient', [IngredientsController::class, 'getList']);
Route::middleware('auth:sanctum')->get('/user', [UserController::class, 'getUser']);
Route::middleware('auth:sanctum')->get('/recipe-detail/{id}', [RecipeController::class, 'getDetails']);
Route::middleware('auth:sanctum')->get('/saved-recipe', [UserSavedRecipeController::class, 'getList']);
Route::middleware('auth:sanctum')->post('/save-recipe/{id}', [UserSavedRecipeController::class, 'userSaveRecipe']);
Route::middleware('auth:sanctum')->get('/randomize', [RandomizerController::class, 'randomizeMealPlan']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/preferences', [UserPreferencesController::class, 'getPreferences']);
    Route::post('/preferences', [UserPreferencesController::class, 'updatePreferences']);
});

Route::get('/shared', [RecipeShareController::class, 'show'])->name('recipe.share');
