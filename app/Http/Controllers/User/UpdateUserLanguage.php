<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Asset;

class UpdateUserLanguage extends Controller
{
    public function __invoke(Request $request)
    {
        $request()->user()->update(['lang' => $request->input('lang','en')]);
        return response()->json($user);
    }
}
