<?php

namespace App\Mail\Booking;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Mail\Mailable;

class BookingCancelledAdminMail extends Mailable
{
    use Queueable, SerializesModels;

    public Booking $booking;
    public User $admin;

    public function __construct(Booking $booking)
    {
        $this->booking = $booking->loadMissing(['user','origin','destination']);
        $this->admin   = User::getAdmin();
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: t('A booking has been cancelled by the client')
        );
    }

    protected function withCommonData(): array
    {
        return [
            'booking' => $this->booking,
            'user'    => $this->booking->user,
            'email'   => $this->booking->email,
            'admin'   => $this->admin,
        ];
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.bookings.cancelled_admin',
            with: $this->withCommonData()
        );
    }
}
