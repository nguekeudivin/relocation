<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BasePaymentMail extends Mailable
{
    use Queueable, SerializesModels;

    public Booking $booking;

    public function __construct(Booking $booking)
    {
        $this->booking = $booking->loadMissing(['user', 'origin', 'destination']);
    }

    protected function withCommonData(): array
    {
        return [
            'booking' => $this->booking,
            'user'    => $this->booking->user,
        ];
    }
}
