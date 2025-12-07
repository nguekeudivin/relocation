<?php

namespace App\Mail\Booking;

use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BookingConfirmedMail extends Mailable
{
    use Queueable, SerializesModels;

    public Booking $booking;

    public function __construct(Booking $booking, ?string $forcedLocale = null)
    {
        $this->booking = $booking->loadMissing(['user', 'origin', 'destination']);
    }

    public function greetingName(): string
    {
        if ($this->booking->user?->first_name) {
            return $this->booking->user->first_name;
        }
        return t('Dear Customer');
    }

    protected function withCommonData(): array
    {
        return [
            'booking' => $this->booking,
            'user'    => $this->booking->user,
            'greetingName' => $this->greetingName(),
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
            markdown: 'emails.bookings.confirmed',
            with: $this->withCommonData()
        );
    }
}
