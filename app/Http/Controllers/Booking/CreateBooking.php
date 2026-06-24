<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CreateBooking extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {

        $validated = $request->validate([
            'user_id'       => 'nullable',
            'date'           => 'required',
            'from_address'   => 'required',
            'to_address'     => 'required',
            'from_lat'       => 'nullable|numeric',
            'from_lng'       => 'nullable|numeric',
            'to_lat'         => 'nullable|numeric',
            'to_lng'         => 'nullable|numeric',
            'first_name'     => 'required',
            'last_name'      => 'required',
            'email'          => 'required|email',
            'distance'       => 'required|numeric',
            'distance_paderborn' => 'required|numeric',
            'workers'        => 'required|integer|min:1|max:100',
            'car_type'       => ['nullable', Rule::in(['bus', 'van'])],
            'duration'       => 'required|numeric|min:2',
            'transport_price' => 'required'
        ]);

        $validated['user_id'] = $request->input("user_id");

        try { 
            $booking = SaveBooking::call($validated, $request->input('lang', 'en'));
            

        }catch(\Exception $e){

            return response()->json([
                'message' => $e->getMessage()
            ],409);
        }
        
        return response()->json($booking, 201);
    }
}