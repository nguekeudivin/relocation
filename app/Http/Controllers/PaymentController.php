<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Notification;
use App\Models\Booking;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session as CheckoutSession;

class PaymentController extends Controller
{
    public function checkout(Request $request, Booking $booking)
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));
        $checkoutSession = CheckoutSession::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'eur',
                    'unit_amount' => $booking->amount * 100 , // amount in cents (20 USD)
                    'product_data' => [
                        'name' => 'Booking',
                    ],
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => route('payment.success') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('payment.cancel'),
            'metadata' => [
                'booking_id' => $booking->id,

            ],
        ]);

        return redirect($checkoutSession->url,303);
    }

    public function success(Request $request)
    {
        $sessionId = $request->get('session_id');

        if (!$sessionId) {
            abort(400, 'Session ID is required.');
        }

        Stripe::setApiKey(env('STRIPE_SECRET'));
        $session = CheckoutSession::retrieve($sessionId);

         // Update the booking status.
        $booking = Booking::find($session->metadata->booking_id);
        $payment = Payment::create([
            'user_id' => $booking->user_id, 
            'amount' => $booking->amount,
            'method' => 'card',
            'processed_at' => now()
        ]);

        // You can check payment status
        if ($session->payment_status === 'paid') {
            // Payment success
            $payment->update(['status' => 'completed']);
            $booking->update(['status' => 'paid']);
            // Create a notification.

            // Send a mail notification here.

            // Redirect to the booking page with a success message.
            return redirect('/user/bookings?m=Success')
                ->with('success', 'Payment proceed with success');

        } else {
            // Payment not completed
            $payment->update(['status' => 'failed']);
            return redirect('/user/bookings?m=Failed')->with('warning', 'Payment failed');
        }
    }

    public function cancel()
    {
        return redirect('/user/bookings?m=Cancel')->with('warning', 'Payment cancel');
    }
}