<?php

namespace App\Http\Controllers;

use App\Models\Ingredients;

class IngredientsController extends Controller
{
    //

    // get ingredient list with optional name filter
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
