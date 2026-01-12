<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    // get user data
    public function getUser (){
        return Auth::user();
    }
}
