<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\JsonResponse;

use Illuminate\Support\Facades\Mail;
use App\Models\Setting;
use App\Mail\NotifyPaymentMail;

class NotifyPayment extends Controller
{
    public function __invoke(Booking $booking): JsonResponse
    {
        $booking->update(['status' => 'notified']);
        $settings = Setting::all()->pluck('value', 'code');

        Mail::to($settings['notification_email'])->queue(new NotifyPaymentMail(($booking)));

        return response()->json($booking, 200);
    }
}
