<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

use Illuminate\Support\Facades\Mail;
use App\Mail\BookingConfirmedMail;

class ConfirmBooking extends Controller
{
    public function __invoke(Booking $booking): JsonResponse
    {
        if ($booking->status === 'paid') {
            return response()->json([
                'message' => 'This booking is already confirmed.'
            ], 422);
        }

        if (!in_array($booking->status, ['pending', 'notified'])) {
            return response()->json([
                'message' => 'This booking cannot be confirmed.'
            ], 422);
        }

        $booking->update([
            'status' => 'paid'
        ]);

        Mail::to($booking->email)->queue(new BookingConfirmedMail($booking));

        $booking->refresh();
        $booking->load(Booking::LOAD);

        return response()->json($booking, 200);
    }
}
