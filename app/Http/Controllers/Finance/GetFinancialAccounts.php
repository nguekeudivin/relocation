<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FinanceAccount;

class GetFinanceAccounts extends Controller
{
    public function __invoke(Request $request)
    {
        // $page       = $request->input('page', 1);
        // $perPage    = $request->input('per_page', 15);
        $keyword    = $request->input('keyword');
        $type       = $request->input('type');

        $query = FinanceAccount::with('user','transactions');

        if ($keyword) {
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%")
                  ->orWhere('phone_number', 'like', "%{$keyword}%")
                  ->orWhere('bank_name', 'like', "%{$keyword}%")
                  ->orWhere('account_number', 'like', "%{$keyword}%")
                  ->orWhereHas('user', function ($q2) use ($keyword) {
                      $q2->where('first_name', 'like', "%{$keyword}%")
                         ->orWhere('last_name', 'like', "%{$keyword}%")
                         ->orWhere('email', 'like', "%{$keyword}%")
                         ->orWhere('phone_number', 'like', "%{$keyword}%");
                  });
            });
        }

        if ($type) {
            $types = is_array($type) ? $type : [$type];
            $query->whereIn('type', $types);
        }

        $accounts = $query
            ->orderBy('created_at', 'desc')->get();
            // ->paginate($perPage, ['*'], 'page', $page);

        return response()->json($accounts);
    }
}
