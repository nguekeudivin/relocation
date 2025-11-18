<?php

namespace App\Http\Controllers\Slot;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Slot;
use App\Models\User;
use App\Models\Setting;

class CreateSlot extends Controller
{
    public function __invoke(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id'  => 'required|exists:users,id',
            'date'     => 'required|date',
        ]);
 
        $slot = [];

        return response()->json($meeting, 201);
    }
}
