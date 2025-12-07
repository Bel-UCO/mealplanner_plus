<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecipeUtensil extends Model
{
    use HasFactory;

    public function belongsToRecipe() {
        return $this->belongsTo(Recipe::class, 'id_recipe');
    }

    public function belongsToUtensil() {
        return $this->belongsTo(Utensil::class, 'id_utensil');
    }
}
