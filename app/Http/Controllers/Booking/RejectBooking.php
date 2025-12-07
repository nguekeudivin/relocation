<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

use Illuminate\Support\Facades\Mail;
use App\Mail\Booking\BookingRejectedMail;
use App\Mail\Booking\BookingRejectedAdminMail;
use App\Models\User;

class RejectBooking extends Controller
{
    public function __invoke(Request $request, Booking $booking): JsonResponse
    {
        if ($booking->status === 'rejected') {
            return response()->json([
                'message' => 'This booking is already rejected.'
            ], 422);
        }

        if (!in_array($booking->status, ['pending'])) {
            return response()->json([
                'message' => 'This booking cannot be rejected.'
            ], 422);
        }

        $booking->update([
            'status' => 'rejected'
        ]);

        Mail::to($booking->email)->send(new BookingRejectedMail($booking));
        Mail::to(User::getAdmin()->email)->send(new BookingRejectedAdminMail($booking));

        $booking->refresh();
        $booking->load(Booking::LOAD);

        return response()->json($booking, 200);
    }
}
