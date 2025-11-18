<?php

namespace App\Http\Controllers\Meeting;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Meeting;

class GetMeetings extends Controller
{
    public function __invoke(Request $request)
    {
        $keyword = $request->input('keyword');
        $userId  = $request->input('user_id');
        $date    = $request->input('date');

        $query = Meeting::with(['user']);

        if ($keyword) {
            $query->where(function ($q) use ($keyword) {
                $q->where('location', 'like', "%{$keyword}%");

                $q->orWhereHas('user', function ($subq) use ($keyword) {
                    $subq->where('first_name', 'like', "%{$keyword}%")
                         ->orWhere('last_name', 'like', "%{$keyword}%");
                });
            });
        }

        if ($userId) {
            $query->where('user_id', $userId);
        }

        if ($date) {
            $query->whereDate('date', $date);
        }

        $meetings = $query->orderBy('date', 'desc')->get();

        return response()->json($meetings);
    }
}