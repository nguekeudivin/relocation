<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

use Illuminate\Support\Facades\Mail;
use App\Mail\Booking\BookingCancelledMail;
use App\Mail\Booking\BookingCancelledAdminMail;
use App\Models\User;

class CancelBooking extends Controller
{
    public function __invoke(Request $request, Booking $booking): JsonResponse
    {
        if ($booking->status === 'cancelled') {
            return response()->json([
                'message' => 'This booking is already cancelled.'
            ], 422);
        }

        if (!in_array($booking->status, ['pending', 'paid', 'confirmed'])) {
            return response()->json([
                'message' => 'This booking cannot be cancelled.'
            ], 422);
        }

        $booking->update([
            'status' => 'cancelled'
        ]);

        Mail::to($booking->email)->send(new BookingCancelledMail($booking));
        Mail::to(User::getAdmin()->email)->send(new BookingCancelledAdminMail(($booking)));

        $booking->refresh();

        $booking->load(Booking::LOAD);

        return response()->json($booking, 200);
    }
}