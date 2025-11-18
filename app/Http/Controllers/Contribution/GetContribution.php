<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Contribution;

class GetContribution extends Controller
{
    public function __invoke(Request $request, Contribution $contribution){
        return response()->json($contribution,200);
    }
}
