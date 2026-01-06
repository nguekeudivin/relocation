<?php
namespace App\Mail;

use App\Http\Controllers\Booking\GetInvoiceData;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Barryvdh\DomPDF\Facade\Pdf;

class BookingCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public Booking $booking;

    public function __construct(Booking $booking)
    {
        // On charge les relations nécessaires pour éviter les requêtes N+1
        $this->booking = $booking->loadMissing(['user', 'origin', 'destination']);
    }

    /**
     * Retourne le nom à utiliser dans le message de bienvenue
     */
    public function greetingName(): string
    {
        if ($this->booking->user?->first_name) {
            return $this->booking->user->first_name;
        }

        return t('Dear Customer');
    }

    /**
     * Données communes injectées dans le mail Markdown
     */
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
        return new Envelope(
            subject: t('Your booking has been received') . ' - #' . $this->booking->id
        );
    }

    public function content(): Content
    {
       return new Content(
            markdown: "emails.booking_created",
            with: $this->withCommonData()
        );
    }

    /**
     * Génère et attache la facture PDF au mail
     */
    public function attachments(): array
    {
        $data = GetInvoiceData::call($this->booking);

        $pdf = Pdf::loadView('pdf.invoice', $data);

        return [
            Attachment::fromData(fn () => $pdf->output(), "Facture_AR-{$this->booking->id}.pdf")
                ->withMime('application/pdf'),
        ];
    }
}