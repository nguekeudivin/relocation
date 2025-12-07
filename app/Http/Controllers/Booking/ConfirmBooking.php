<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

use Illuminate\Support\Facades\Mail;
use App\Mail\Booking\BookingConfirmedMail;
use App\Mail\Booking\BookingConfirmedAdminMail;
use App\Models\User;

class ConfirmBooking extends Controller
{
    public function __invoke(Request $request, Booking $booking): JsonResponse
    {
        if ($booking->status === 'confirmed') {
            return response()->json([
                'message' => 'This booking is already confirmed.'
            ], 422);
        }

        if (!in_array($booking->status, ['pending', 'paid'])) {
            return response()->json([
                'message' => 'This booking cannot be confirmed.'
            ], 422);
        }

        $booking->update([
            'status' => 'confirmed'
        ]);

        Mail::to($booking->email)->send(new BookingConfirmedMail($booking));
        Mail::to(User::getAdmin()->email)->send(new BookingConfirmedAdminMail($booking));

        $booking->refresh();
        $booking->load(Booking::LOAD);

        return response()->json($booking, 200);
    }
}
