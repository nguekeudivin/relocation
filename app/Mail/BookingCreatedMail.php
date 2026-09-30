<?php
namespace App\Mail;

use App\Http\Controllers\Booking\GetInvoiceData;
use App\Services\TokenService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Barryvdh\DomPDF\Facade\Pdf;

class BookingCreatedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public Booking $booking;

    public string $lang;

    public function __construct(Booking $booking, string $lang)
    {
        // On charge les relations nécessaires pour éviter les requêtes N+1
        $this->booking = $booking->loadMissing(['user', 'origin', 'destination']);

        $this->lang = $lang;
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
        // Le token dynamique ne survit pas à la sérialisation en queue — on le régénère à l'envoi.
        $this->booking->token = $this->booking->token ?? TokenService::generate(['id' => $this->booking->id]);

        return [
            'booking'      => $this->booking,
            'user'         => $this->booking->user,
            'email'        => $this->booking->email,
            'greetingName' => $this->greetingName(),
            'lang' => $this->lang,
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
        $data = GetInvoiceData::call($this->booking, $this->lang);

        $pdf = Pdf::loadView('pdf.invoice', $data);

        return [
            Attachment::fromData(fn () => $pdf->output(), "Facture_AR-{$this->booking->id}.pdf")
                ->withMime('application/pdf'),
        ];
    }
}