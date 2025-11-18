<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CreateDebit extends Controller
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
            "status" => Payment::STATUS_PENDING,
            "callback" => $request->callback,
        ]);


        $i_space_key = config("app.nokash_i_space_key");
        $app_space_key = config("app.nokash_app_space_key");

        // Generate payout token.
        $response = Http::post("https://api.nokash.app/lapas-on-trans/trans/auth?i_space_key=$i_space_key&app_space_key=$app_space_key");

        if ($response->successful()) {

            if ($response->json()["status"] == "LOGIN_SUCCESS") {

                // Start the payout process.
                $response = Http::withHeaders([
                    "auth-code" => $response->json()["data"],
                ])->post("https://api.nokash.app/lapas-on-trans/trans/api-payout-request/407", [
                    "i_space_key" => $i_space_key,
                    "app_space_key" => $app_space_key,
                    "payment_type" => "CM_MOBILEMONEY",
                    "payment_method" => $payment->method,
                    "order_id" => $payment->id,
                    "amount" => "".$payment->debit."",
                    'country' => 'CM',
                    "user_data" => [
                        "user_phone" => "237".$payment->phone_number,
                    ]
                ]);

                if ($response->successful()) {
                    $payment->transaction_id = $response->json()['data']['id'];
                    $payment->save();
                    return response()->json($payment, 201);
                } else {
                    $payment->update(["status" => Payment::STATUS_FAILED]);
                    return  response()->json([
                        'status' => 'error',
                        'message' => $response->json(),
                    ], 422);
                }

            } else {
                $payment->update(["status" => Payment::STATUS_FAILED]);
                return  response()->json([
                        'status' => 'error',
                        'message' => $response->json(),
                ], 422);
            }
        } else {
            $payment->update(["status" => Payment::STATUS_FAILED]);
            return  response()->json([
                        'status' => 'error',
                        'message' => 'System not available for payment. Try later',
            ], 422);
        }
    }
}
