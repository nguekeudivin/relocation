<?php

namespace App\Http\Controllers\Slot;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Slot;

class DeleteSlot extends Controller
{
    public function __invoke(Request $request, Slot $meeting){
        
        $temp = $meeting->toArray();

        // Supprimer les contributions generer pour la reuinion.
        $meeting->contributions()->delete();

        // Supprimer la reuinion.
        $meeting->delete();

        return response($temp);
    }
}
