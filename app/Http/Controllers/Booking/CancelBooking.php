<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CancelBooking extends Controller
{
    public function __invoke(Request $request, Booking $booking): JsonResponse
    {
        if ($booking->status === 'cancelled') {
            return response()->json([
                'message' => 'This booking is already cancelled.'
            ], 422);
        }

        if (!in_array($booking->status, ['waiting_payment', 'paid', 'confirmed'])) {
            return response()->json([
                'message' => 'This booking cannot be cancelled.'
            ], 422);
        }

        $booking->update([
            'status' => 'cancelled'
        ]);

        $booking->refresh();

        $booking->load(Booking::LOAD);

        return response()->json($booking, 200);
    }
}