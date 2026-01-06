<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CompleteBooking extends Controller
{
    public function __invoke(Request $request, Booking $booking): JsonResponse
    {
        if ($booking->status === 'completed') {
            return response()->json([
                'message' => 'This booking is already completed.'
            ], 422);
        }

        if (!in_array($booking->status, ['paid'])) {
            return response()->json([
                'message' => 'Only confirmed bookings can be marked as completed.'
            ], 422);
        }

        $booking->update([
            'status' => 'completed'
        ]);

        $booking->refresh();
        $booking->load(Booking::LOAD);

        return response()->json($booking, 200);
    }
}
