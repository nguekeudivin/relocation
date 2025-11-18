<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class GetUser extends Controller
{
    public function __invoke(Request $request, User $user){
        return response()->json($user,200);
    }
}
