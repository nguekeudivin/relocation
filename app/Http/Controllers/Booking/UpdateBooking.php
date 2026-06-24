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
            'from_address'   => 'required',
            'to_address'     => 'required',
            'from_lat'       => 'nullable|numeric',
            'from_lng'       => 'nullable|numeric',
            'to_lat'         => 'nullable|numeric',
            'to_lng'         => 'nullable|numeric',
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
            'address' => $data['from_address'],
            'lat'     => $data['from_lat'] ?? null,
            'lng'     => $data['from_lng'] ?? null,
        ]);

        $booking->destination->update([
            'address' => $data['to_address'],
            'lat'     => $data['to_lat'] ?? null,
            'lng'     => $data['to_lng'] ?? null,
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