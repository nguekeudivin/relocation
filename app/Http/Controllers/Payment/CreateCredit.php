<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use App\Models\Payment;

class CreateCredit extends Controller
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
            "status" => Payment::STATUS_PENDING,
            "callback" => $request->callback,
        ]);

        // The phone number is optional, if not provided we use the user's phone number.
        $paymentPhoneNumber = "237".$request->phone_number;

        // Send the payment request to nokash.
        $response = Http::post("https://api.nokash.app/lapas-on-trans/trans/api-payin-request/407", [
            'i_space_key' => config('app.nokash_i_space_key'),
            'app_space_key' => config('app.nokash_app_space_key'),
            'amount' => "".$payment->credit."",
            'order_id' => $payment->id,
            'country' => 'CM',
            "payment_type" => "CM_MOBILEMONEY",
            'payment_method' => $payment->method,
            "user_data" => [
                "user_phone" => $paymentPhoneNumber,
            ]
        ]);

        // Handle the responseP
        if ($response->successful()) {
            // Update the financial transaction id.
            $data = $response->json();
            switch ($data["status"]) {
                case "REQUEST_OK":
                    $payment->transaction_id = $data['data']['id'];
                    $payment->save();
                    // A worker will now request the payment financial transaction an check if the status is complete.
                    return response()->json($payment, 201);
                    break;
                case "REQUEST_BAD_INFOS":
                    $payment->update(["status" => Payment::STATUS_FAILED]);
                    return response()->json([
                        'status' => 'error',
                        'message' => $data['message'],
                    ], 400);
                    break;
                default:
                    $payment->update(["status" => Payment::STATUS_FAILED]);
                    return response()->json([
                        'status' => 'error',
                        'message' => $data['message'],
                    ], 400);
                    DB::commit();
            }

        } else {
            return response()->json($response->body(), 500);
        }
    }
}
