<?php

namespace App\Mail\Payment;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Mail\Mailable;

class PaymentFailedAdminMail extends Mailable
{
    use Queueable, SerializesModels;

    public Booking $booking;
    public User $admin;

    public function __construct(Booking $booking)
    {
        $this->booking = $booking->loadMissing(['user', 'origin', 'destination']);
        $this->admin   = User::getAdmin();
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: t('A payment attempt has failed'));
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
            markdown: 'emails.payment.payment_failed_admin',
            with: $this->withCommonData()
        );
    }
}
