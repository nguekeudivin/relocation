<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChangeUserLanguage extends Controller
{
    public function __invoke(Request $request)
    {
        $user = Auth::user();
        $user->lang = $request->lang;
        $user->save();

        return redirect()->back();
    }
}
