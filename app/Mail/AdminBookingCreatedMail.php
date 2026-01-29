<?php

namespace App\Mail;

use App\Http\Controllers\Booking\GetInvoiceData;
use App\Models\Booking;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminBookingCreatedMail extends Mailable
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
            'email'   => $this->booking->email,
        ];
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: t('New booking submitted') . ' - #' . $this->booking->id
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.admin_booking_created',
            with: $this->withCommonData()
        );
    }

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
