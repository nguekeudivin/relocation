<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use App\Mail\Booking\BookingCompletedMail;
use App\Mail\Booking\BookingCompletedAdminMail;
use App\Models\User;

class CompleteBooking extends Controller
{
    public function __invoke(Request $request, Booking $booking): JsonResponse
    {
        if ($booking->status === 'completed') {
            return response()->json([
                'message' => 'This booking is already completed.'
            ], 422);
        }

        if (!in_array($booking->status, ['confirmed'])) {
            return response()->json([
                'message' => 'Only confirmed bookings can be marked as completed.'
            ], 422);
        }

        $booking->update([
            'status' => 'completed'
        ]);

        Mail::to($booking->email)->send(new BookingCompletedMail($booking));
        Mail::to(User::getAdmin()->email)->send(new BookingCompletedAdminMail($booking));

        $booking->refresh();
        $booking->load(Booking::LOAD);

        return response()->json($booking, 200);
    }
}
