<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Mail\Mailable;

class NotifyPaymentMail extends Mailable
{
    use Queueable, SerializesModels;

    public Booking $booking;
    public $admin;

    public function __construct(Booking $booking)
    {
        $this->booking = $booking->loadMissing(['user', 'origin', 'destination']);
        $this->admin = User::getAdmin();
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: t('Payment Notification for Booking #:id', ['id' => $this->booking->id])
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.notify_payment',
            with: [
                'booking' => $this->booking,
                'user'    => $this->booking->user,
                'email'   => $this->booking->email,
                'admin'   => $this->admin,
            ]
        );
    }
}