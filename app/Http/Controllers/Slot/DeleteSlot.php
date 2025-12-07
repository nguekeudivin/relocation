<?php

namespace App\Http\Controllers\Slot;

use App\Http\Controllers\Controller;
use App\Models\Slot;

class DeleteSlot extends Controller
{
    public function __invoke( Slot $slot){
        
        $temp = $slot->toArray();

        $slot->delete();

        return response()->json($temp);
    }
}
