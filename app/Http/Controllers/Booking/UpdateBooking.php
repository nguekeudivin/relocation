<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class UpdateBooking extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, Booking $booking): JsonResponse
    {

        $data = $request->validate([
            'date'           => 'required', 
            'from_city'      => 'required',      
            'to_city'        => 'required',
            'from_street'    => 'required',
            'to_street'      => 'required',
            'workers'        => 'required|integer|min:1|max:100',
            'car_type'       => ['nullable', Rule::in(['bus', 'van'])],
            'duration'       => 'required|numeric|min:2',
            'transport_price' => 'required'
        ]);

        $settings = Setting::all()->pluck('value', 'code');
        $workersCost  = $settings['worker_tax'] * $data['workers'];
        $durationCost = $settings['price_per_hour']    * $data['duration'];
        $carsCost     = isset($data['car_type']) ?  $data['transport_price'] : 0;

        $booking->origin->update([
            'city'   => $data['from_city'],
            'street' => $data['from_street'],
        ]);

        $booking->destination->update([
            'city'   => $data['to_city'],
            'street' => $data['to_street'],
        ]);

        $booking->update([
            'date'           => $data['date'],
            'workers'        => $data['workers'],
            'duration'       => $data['duration'],
            'car_type'       => $data['car_type'],
            'amount'         => $workersCost + $durationCost + $carsCost,
        ]);
        
        $booking->refresh();
        $booking->load(Booking::LOAD);

        return response()->json($booking, 201);
    }
}