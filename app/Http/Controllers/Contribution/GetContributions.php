<?php

namespace App\Http\Controllers\Contribution;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Contribution;

class GetContributions extends Controller
{
    public function __invoke(Request $request)
    {
        $page       = $request->input('page', 1);
        $perPage    = $request->input('per_page', 15);
        $keyword    = $request->input('keyword');
        $status     = $request->input('status');
        $type       = $request->input('type');
        $userId     = $request->input('user_id'); // <-- New
        $dueBefore  = $request->input('due_date_before');
        $dueAfter   = $request->input('due_date_after');
        $paidBefore = $request->input('payment_date_before');
        $paidAfter  = $request->input('payment_date_after');

        $query = Contribution::query();

        // 🔎 Filter by user_id
        if ($userId) {
            $query->where('user_id', $userId);
        }

        // 🔎 keyword search (on related user fields)
        if ($keyword) {
            $query->whereHas('user', function ($q) use ($keyword) {
                $q->where('first_name', 'like', "%{$keyword}%")
                  ->orWhere('last_name', 'like', "%{$keyword}%")
                  ->orWhere('email', 'like', "%{$keyword}%")
                  ->orWhere('phone_number', 'like', "%{$keyword}%");
            });
        }

        // 🔎 status filter
        if ($status) {
            $statuses = is_array($status) ? $status : [$status];
            $query->whereIn('status', $statuses);
        }

        // 🔎 type filter
        if ($type) {
            $types = is_array($type) ? $type : [$type];
            $query->whereIn('type', $types);
        }

        // 📅 date filters
        if ($dueBefore)  $query->whereDate('due_date', '<=', $dueBefore);
        if ($dueAfter)   $query->whereDate('due_date', '>=', $dueAfter);
        if ($paidBefore) $query->whereDate('payment_date', '<=', $paidBefore);
        if ($paidAfter)  $query->whereDate('payment_date', '>=', $paidAfter);

        $query->with(['user','transactions.financial_account', 'transactions.proofs'])
              ->orderBy('created_at', 'desc');

        if($page == 0){
            $contributions = $query->get();
        } else { 
            $contributions = $query->paginate($perPage, ['*'], 'page', $page);
        }
        
        return response()->json($contributions);
    }
}
