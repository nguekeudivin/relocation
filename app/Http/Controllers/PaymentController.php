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
                    'unit_amount' => $booking->total_price * 100 , // amount in cents (20 USD)
                    'product_data' => [
                        'name' => 'Ride Booking',
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

        return redirect($checkoutSession->url);
    }

    public function success(Request $request)
    {
        $sessionId = $request->get('session_id');

        if (!$sessionId) {
            abort(400, 'Session ID is required.');
        }

        Stripe::setApiKey(env('STRIPE_SECRET'));
        $session = CheckoutSession::retrieve($sessionId);

        // You can check payment status
        if ($session->payment_status === 'paid') {
            // Payment success
            // Update the booking status.
            $booking = Booking::find($session->metadata->booking_id);

            $booking->status = 'CONFIRMED';
            $booking->save();

            if ($booking->package_id != null) {
                $booking->ride->package_weight = $booking->ride->package_weight - $booking->package->weight;
                $booking->ride->save();
            }

            // Create a notification.
            $notification = Notification::create([
                'user_id' => $booking->ride->driver->id, // Recipient user
                'notificable_id' => $booking->id,
                'notificable_type' => Booking::class,
                'content' => 'Payment confirmed for a booking',
                'link' => '/account/rides/'.$request->ride_id, // or a dynamic chat route
                'is_read' => false,
            ]);

            // Redirect to the booking page with a success message.
            return redirect('/bookings/'.$booking->id)
                ->with('success', 'Payment proceed with success')
                ->with('notificationToSend', $notification->id);

        } else {
            // Payment not completed
            return redirect('/bookings')->with('warning', 'Payment failed');
        }
    }

    public function cancel()
    {
        return redirect('/bookings') > with('warning', 'Payment cancel');
    }

    public function index()
    {
        return Payment::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'passenger_id' => 'required|exists:users,id',
            'transaction_id' => 'required|string|unique:payments,transaction_id',
            'booking_id' => 'required|exists:bookings,id',
            'amount' => 'required|numeric|min:0',
            'method' => 'required|string',
        ]);

        $payment = Payment::create($validated);
        return response()->json($payment, 201);
    }

    public function show(Payment $payment)
    {
        return $payment;
    }

    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'method' => 'sometimes|string',
            'amount' => 'sometimes|numeric|min:0',
        ]);

        $payment->update($validated);
        return response()->json($payment);
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();
        return response()->json(null, 204);
    }
}