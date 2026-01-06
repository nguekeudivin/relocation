<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class GetBookings extends Controller
{
    public function __invoke(Request $request)
    {
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

        $query = $query
            ->orderBy('created_at', 'desc');

        if($request->has('page') || $request->has('per_page')){
           $per_page = $request->input('per_page', 15);
           return response()->json($query->paginate($per_page));
        }else{
           return response()->json($query->get());
        }

    }
}