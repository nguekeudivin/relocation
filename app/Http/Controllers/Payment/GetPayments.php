<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;

class GetPayments extends Controller
{
    public function __invoke(Request $request)
    {
        $page          = $request->input('page', 1);
        $perPage       = $request->input('per_page', 15);
        $keyword       = $request->input('keyword');
        $status        = $request->input('status');
        $method        = $request->input('method');
        $processedBefore = $request->input('processed_before');
        $processedAfter  = $request->input('processed_after');
        $createdBefore = $request->input('created_before');
        $createdAfter  = $request->input('created_after');

        $query = Payment::query();

        if ($keyword) {
            $query->whereHas('user', function ($q) use ($keyword) {
                $q->where('first_name', 'like', "%{$keyword}%")
                  ->orWhere('last_name', 'like', "%{$keyword}%")
                  ->orWhere('email', 'like', "%{$keyword}%")
                  ->orWhere('phone_number', 'like', "%{$keyword}%");
            });
        }

        if ($status) {
            $statuses = is_array($status) ? $status : [$status];
            $query->whereIn('status', $statuses);
        }

        if ($method) {
            $methods = is_array($method) ? $method : [$method];
            $query->whereIn('method', $methods);
        }

        if ($processedBefore) {
            $query->whereDate('processed_at', '<=', $processedBefore);
        }
        if ($processedAfter) {
            $query->whereDate('processed_at', '>=', $processedAfter);
        }

        if ($createdBefore) {
            $query->whereDate('created_at', '<=', $createdBefore);
        }
        if ($createdAfter) {
            $query->whereDate('created_at', '>=', $createdAfter);
        }


        $payments = $query
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json($payments);
    }
}
