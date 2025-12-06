<?php

namespace App\Mail\Booking;

use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BookingCreatedMail  extends Mailable
{
    use Queueable, SerializesModels;

    public Booking $booking;
    public string $mailLocale;

    public function __construct(Booking $booking, ?string $forcedLocale = null)
    {
        $this->booking = $booking->loadMissing(['user', 'origin', 'destination']);
    }

    /**
     * Retourne le nom à utiliser dans le greeting
     */
    public function greetingName(): string
    {
        // Si l'utilisateur a un prénom, on l'utilise
        if ($this->booking->user?->first_name) {
            return $this->booking->user->first_name;
        }

        // Sinon texte par défaut
        return t('Dear Customer');
    }

    protected function withCommonData(): array
    {
        return [
            'booking'      => $this->booking,
            'user'         => $this->booking->user,
            'email'        => $this->booking->email,
            'greetingName' => $this->greetingName(),
        ];
    }

    public function envelope(): Envelope
    {
        $subject = t('Your booking has been received');

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
       return new Content(
            markdown: "emails.bookings.created",
            with: $this->withCommonData()
        );
    }
}
