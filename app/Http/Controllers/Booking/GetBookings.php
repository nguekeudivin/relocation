<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class GetBookings extends Controller
{
    public function __invoke(Request $request)
    {
        $page     = $request->input('page', 1);
        $perPage  = $request->input('per_page', 15);
        $keyword  = $request->input('keyword');
        $status   = $request->input('status');
        $userId   = $request->input('user_id');
        $email    = $request->input('email');

        $query = Booking::query()
            ->with(Booking::LOAD);

        if ($userId) {
            $query->where('user_id', $userId);
        }

        if ($email) {
            $query->where('email', 'like', "%{$email}%");
        }

        if ($keyword) {
            $query->where(function ($q) use ($keyword) {
                $q->where('observation', 'like', "%{$keyword}%")
                  ->orWhere('email', 'like', "%{$keyword}%")
                  ->orWhereHas('origin', fn($o) => $o
                      ->where('city', 'like', "%{$keyword}%")
                      ->orWhere('street', 'like', "%{$keyword}%")
                  )
                  ->orWhereHas('destination', fn($d) => $d
                      ->where('city', 'like', "%{$keyword}%")
                      ->orWhere('street', 'like', "%{$keyword}%")
                  );
            });
        }

        if ($status) {
            $statuses = is_array($status) ? $status : [$status];
            $query->whereIn('status', $statuses);
        }

        $bookings = $query
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json($bookings);
    }
}