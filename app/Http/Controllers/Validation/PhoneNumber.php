<?php

namespace App\Http\Controllers\Validation;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class PhoneNumber extends Controller
{
    public function __invoke(Request $request)
    {
        $user = User::where("phone_number", $request->phone_number)->first();
        if ($user) {
            return response()->json([
                'message' => 'There is a use with this phone_number'
            ], 422);
        } else {
            return response()->json('valid', 200);
        }
    }
}
