<?php

use App\Http\Controllers\GoogleAuthController;
use App\Models\Recipe;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RecipeController;

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
