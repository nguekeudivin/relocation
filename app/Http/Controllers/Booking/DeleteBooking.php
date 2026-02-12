<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use App\Models\Booking;

class DeleteBooking extends Controller
{
    public function __invoke(Booking $booking)
    {
        $booking->delete();

        return redirect()->back();
    }
}
