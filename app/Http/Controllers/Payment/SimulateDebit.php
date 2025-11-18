<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SimulateDebit extends Controller
{
    public function __invoke(Request $request)
    {
        $data = $request->validate([
           'amount' => 'required',
           'method' => 'required|in:ORANGE_MONEY,MTN_MOMO',
           'phone_number' => 'required|string|max:20',
        ]);

        $user = Auth::user();
        // if (!$user->canPayout($request->amount)) {
        //     return  response()->json([
        //                 'status' => 'error',
        //                 'message' => 'Insufficient found. You can withdraw this amount.',
        //             ], 422);
        // }

        // Create a pending payment status.
        $payment = Payment::create([
            "user_id" => $user->id,
            "debit" => $request->amount,
            'currency' => 'XAF',
            "method" => $request->method,
            'phone_number' => $request->phone_number,
            "status" => Payment::STATUS_COMPLETED,
            "callback" => $request->callback,
        ]);

        // Run the callback.
        Payment::runCallback($payment);

        return response()->json($payment, 201);
    }
}
