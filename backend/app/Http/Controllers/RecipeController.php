<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RecipeController extends Controller
{
    //

    public function getAll(){
        
    }

    public function getOne(){
        $recipe = Recipe::find(request("id"));

        return $recipe;
    }
}
