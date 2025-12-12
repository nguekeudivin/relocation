<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Booking;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session as CheckoutSession;
use Illuminate\Support\Facades\Mail;
use App\Mail\Payment\PaymentSuccessMail;
use App\Mail\Payment\PaymentSuccessAdminMail;
use App\Mail\Payment\PaymentFailedMail;
use App\Mail\Payment\PaymentFailedAdminMail;

use App\Models\User;

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
                    'unit_amount' => $booking->tax * 100 , // amount in cents (20 USD)
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
            'amount' => $booking->tax,
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
            Mail::to($booking->email)->queue(new PaymentSuccessMail($booking));
            Mail::to(User::getAdmin()->email)->queue(new PaymentSuccessAdminMail(($booking)));

            // Redirect to the booking page with a success message.
            return redirect('/user/bookings?m=Success')
                ->with('success', 'Payment proceed with success');

        } else {

            Mail::to($booking->email)->queue(new PaymentFailedMail($booking));
            Mail::to(User::getAdmin()->email)->queue(new PaymentFailedAdminMail(($booking)));

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