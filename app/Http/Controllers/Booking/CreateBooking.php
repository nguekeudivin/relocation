<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Services\Booking\SaveBooking;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class CreateBooking extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): JsonResponse
    {

        $validated = $request->validate([
            'user_id'       => 'nullable',
            'date'           => 'required', 
            'from_city'      => 'required',      
            'to_city'        => 'required',
            'from_street'    => 'required',
            'to_street'      => 'required',
            'email'          => 'required|email',
            'workers'        => 'required|integer|min:1|max:100',
            'car_type'       => ['required', Rule::in(['bus', 'van'])],
            'duration'       => 'required|numeric|min:2',
            'transport_price' => 'required'
        ]);

        $validated['user_id'] = $request->input("user_id");
        
        $booking = SaveBooking::run($validated);

        return response()->json($booking, 201);
    }
}