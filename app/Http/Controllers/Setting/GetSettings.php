<?php

namespace App\Http\Controllers\Setting; 

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Setting;

class GetSettings extends Controller {

    public function __invoke(Request $request){
        return response()->json(Setting::all(),200);
    }
}

