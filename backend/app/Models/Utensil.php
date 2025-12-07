<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Utensil extends Model
{
    use HasFactory;

    public function hasManyRecipeUtensil() {
        return $this->hasMany(RecipeUtensil::class, 'id_utensil', 'id');
    }
}
