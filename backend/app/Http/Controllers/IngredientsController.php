<?php

namespace App\Http\Controllers;

use App\Models\Ingredients;

class IngredientsController extends Controller
{
    //

    public function getList()
    {
        $ingredientList = Ingredients::where(
            'name',
            'ILIKE',
            '%' . request('name') . '%'
        )->get();

        return $ingredientList;
    }
}
