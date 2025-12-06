<?php

namespace App\Mail;

use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;

class BookingConfirmedAdminMail extends BaseBookingMail
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

    public function envelope(): Envelope
    {
        $subject = t('Booking Confirmed');
        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.bookings.confirmed_admin',
            with: $this->withCommonData()
        );
    }
}
