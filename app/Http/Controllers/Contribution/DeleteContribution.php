<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Contribution;

class DeleteContribution extends Controller
{
    public function __invoke(Request $request, Contribution $contribution){
        $temp = $contribution;
        $contribution->delete();
        return response()->json($temp,200);
    }
}
