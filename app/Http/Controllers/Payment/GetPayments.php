<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;

class GetPayments extends Controller
{
    public function __invoke(Request $request)
    {
        $page      = $request->input('page', 1);
        $perPage   = $request->input('per_page', 15);
        $keyword   = $request->input('keyword');
        $method    = $request->input('method');   // paypal, card, mobile_money
        $status    = $request->input('status');   // pending, completed, failed

        $query = Payment::query()
            ->with('user') // return user data
            ->orderBy('created_at', 'desc');

        /**
         * Keyword search on payment or user fields
         */
        if ($keyword) {
            $query->where(function ($q) use ($keyword) {
                $q->where('transaction_id', 'like', "%{$keyword}%")
                  ->orWhere('phone_number', 'like', "%{$keyword}%")
                  ->orWhere('amount', 'like', "%{$keyword}%")
                  ->orWhereHas('user', function ($u) use ($keyword) {
                      $u->where('first_name', 'like', "%{$keyword}%")
                        ->orWhere('last_name', 'like', "%{$keyword}%")
                        ->orWhere('email', 'like', "%{$keyword}%")
                        ->orWhere('phone_number', 'like', "%{$keyword}%");
                  });
            });
        }

        /**
         * Payment method filter
         */
        if ($method) {
            $methods = is_array($method) ? $method : [$method];
            $query->whereIn('method', $methods);
        }

        /**
         * Status filter
         */
        if ($status) {
            $statuses = is_array($status) ? $status : [$status];
            $query->whereIn('status', $statuses);
        }

        /**
         * Pagination
         */
        $payments = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json($payments);
    }
}
