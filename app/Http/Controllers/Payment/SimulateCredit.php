<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use App\Models\Payment;

class SimulateCredit extends Controller
{
    public function __invoke(Request $request)
    {
        $data = $request->validate([
            'amount' => 'required',
            'method' => 'required|in:ORANGE_MONEY,MTN_MOMO',
            'phone_number' => 'required|string|max:20',
            'status' => 'in:PENDING,FAILED,SUCCEED',
        ]);

        $user = Auth::user();

        // Create a pending payment status.
        $payment = Payment::create([
            "user_id" => $user->id,
            "credit" => $request->amount,
            'debit' => 0,
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
