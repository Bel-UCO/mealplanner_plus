<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Steps extends Model
{
    use HasFactory;

    public function belongsToRecipe() {
        return $this->belongsTo(Recipe::class, 'id_recipe');
    }
}
