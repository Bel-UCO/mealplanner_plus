<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPreferences extends Model
{
    // If your table name is not "user_preferences", set it:
    // protected $table = 'user_preferences';

    // Make these fields mass assignable
    protected $table = 'user_preferences';

    protected $fillable = [
        'id_user',
        'search_by',
        'difficulty',
        'time',
        'diet',
        'category',
        'ingredient',
        'utensil',
    ];

    // If the table doesn't have created_at / updated_at columns:
    // public $timestamps = false;

    // Optional: relation to User
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
}
