<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class GetPayments extends Controller
{
    public function __invoke(Request $request)
    {
        $page     = $request->input('page', 1);
        $perPage  = $request->input('per_page', 15);
        $keyword  = $request->input('keyword');
        $status   = $request->input('status');
        $method   = $request->input('method');
        $userId   = $request->input('user_id');
        $phone    = $request->input('phone_number');

        $query = Payment::with(['user']);

        // Filter by user
        if ($userId) {
            $query->where('user_id', $userId);
        }

        // Filter by phone number
        if ($phone) {
            $query->where('phone_number', 'like', "%{$phone}%");
        }

        // Filter by payment method
        if ($method) {
            $methods = is_array($method) ? $method : [$method];
            $query->whereIn('method', $methods);
        }

        // Filter by status
        if ($status) {
            $statuses = is_array($status) ? $status : [$status];
            $query->whereIn('status', $statuses);
        }

        // Global keyword search
        if ($keyword) {
            $query->where(function ($q) use ($keyword) {
                $q->where('amount', 'like', "%{$keyword}%")
                  ->orWhere('phone_number', 'like', "%{$keyword}%")
                  ->orWhere('transaction_id', 'like', "%{$keyword}%")
                  ->orWhere('method', 'like', "%{$keyword}%")
                  ->orWhere('status', 'like', "%{$keyword}%")

                  // User fields: email, first_name, last_name
                  ->orWhereHas('user', function ($u) use ($keyword) {
                      $u->where('email', 'like', "%{$keyword}%")
                        ->orWhere('first_name', 'like', "%{$keyword}%")
                        ->orWhere('last_name', 'like', "%{$keyword}%");
                  });
            });
        }

        // Sorting + Pagination
        $payments = $query
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json($payments);
    }
}
