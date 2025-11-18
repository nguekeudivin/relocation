<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;

class GetPayment extends Controller
{
    public function __invoke(Payment $payment)
    {
        $payment->load('asset','user','receiver');
        return response()->json($payment);
    }
}
