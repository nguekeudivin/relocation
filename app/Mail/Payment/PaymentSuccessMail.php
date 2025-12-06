<?php

namespace App\Mail\Payment;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use App\Models\Booking;
use Illuminate\Mail\Mailable;

class PaymentSuccessMail extends Mailable
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
            'booking'      => $this->booking,
            'user'         => $this->booking->user,
            'email'        => $this->booking->email,
            'greetingName' => $this->booking->user?->first_name ?: t('Dear Customer')
        ];
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: t('Your payment was successful')
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.payment.payment_success',
            with: $this->withCommonData()
        );
    }
}
