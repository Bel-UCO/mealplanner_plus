<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSavedRecipe extends Model
{
    use HasFactory;

    public function belongsToUser() {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function belongsToRecipe() {
        return $this->belongsTo(Recipe::class, 'id_recipe');
    }
}
