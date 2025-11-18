<?php

namespace App\Http\Controllers\Meeting;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Meeting;

class DeleteMeeting extends Controller
{
    public function __invoke(Request $request, Meeting $meeting){
        
        $temp = $meeting->toArray();

        // Supprimer les contributions generer pour la reuinion.
        $meeting->contributions()->delete();

        // Supprimer la reuinion.
        $meeting->delete();

        return response($temp);
    }
}
