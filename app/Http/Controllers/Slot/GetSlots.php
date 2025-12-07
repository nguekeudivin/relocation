<?php

namespace App\Http\Controllers\Slot;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Slot;

class GetSlots extends Controller
{
    public function __invoke(Request $request)
    {
        $slots = Slot::orderBy('date', 'asc')->get();

        return response()->json($slots);
    }
}
