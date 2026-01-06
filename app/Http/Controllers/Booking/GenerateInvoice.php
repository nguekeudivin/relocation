<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Services\TokenService;
use App\Models\Booking;

class GenerateInvoice extends Controller
{
    /**
     * Handle the incoming request to generate the PDF invoice.
     */
    public function __invoke(Request $request)
    {
        try { 
            // 1. Securely decode the booking ID from the token
            $tokenData = TokenService::decode($request->input('token'));
            if (!$tokenData) return redirect()->back();

            // 2. Load the booking with its essential relationships
            $booking = Booking::with(['origin', 'destination', 'user'])->find($tokenData->id);
            if (!$booking) return redirect()->back();

            $data = GetInvoiceData::call($booking);

            $pdf = Pdf::loadView('pdf.invoice', $data);

            if ($request->has('download')) {
                return $pdf->download("Invoice_AR-{$booking->id}.pdf");
            }

            return $pdf->stream("Invoice_AR-{$booking->id}.pdf");
            
        } catch (\Exception $e) {

            return redirect()->back()->withErrors(['error' => 'Invoice generation failed.']);
        }
    }
}