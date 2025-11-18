<?php

namespace App\Http\Controllers\Setting; 

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Setting;

class SaveManySettings extends Controller {

    public function __invoke(Request $request){

        $settings = [];

        if($request->has('settings')){
            foreach($request->settings as $code => $value){
                $setting =  Setting::find($code);
                if($setting){
                    $setting->update(['value' => $value]);
                }
                $settings[] = $setting;
            }
        }

        return response()->json($settings,200);
    }
}

