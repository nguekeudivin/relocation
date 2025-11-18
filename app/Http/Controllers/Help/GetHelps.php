<?php

namespace App\Http\Controllers\Help;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Help;

class GetHelps extends Controller
{
    public function __invoke(Request $request)
    {
        $page    = $request->input('page', 1);
        $perPage = $request->input('per_page', 15);
        $keyword = $request->input('keyword');
        $status  = $request->input('status');
        $userId  = $request->input('user_id'); // <-- New

        $query = Help::with(['user', 'help_type','transactions.proofs','transactions.financial_account']);

        // 🔎 Filter by user_id
        if ($userId) {
            $query->where('user_id', $userId);
        }

        // 🔎 keyword search (on related user fields)
        if ($keyword) {
            $query->whereHas('user', function($q) use ($keyword) {
                $q->where('first_name', 'like', "%{$keyword}%")
                  ->orWhere('last_name', 'like', "%{$keyword}%")
                  ->orWhere('email', 'like', "%{$keyword}%");
            });
        }

        // 🔎 status filter
        if ($status) {
            $statuses = is_array($status) ? $status : [$status];
            $query->whereIn('status', $statuses);
        }

        $requests = $query->orderBy('created_at', 'desc')
                          ->paginate($perPage, ['*'], 'page', $page);

        return response()->json($requests);
    }
}
