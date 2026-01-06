<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Booking;

class GenerateInvoiceById extends Controller
{
    /**
     * Handle the incoming request to generate the PDF invoice.
     */
    public function __invoke(Request $request,Booking $booking)
    {
        try { 
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