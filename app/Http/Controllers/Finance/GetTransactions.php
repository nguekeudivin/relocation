<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;

class GetTransactions extends Controller
{
    public function __invoke(Request $request)
    {
        $page     = $request->input('page', 1);
        $perPage  = $request->input('per_page', 15);
        $keyword  = $request->input('keyword');
        $status   = $request->input('status');
        $userId   = $request->input('user_id');
        $type = $request->input('type');

        $query = Transaction::with(['user', 'financial_account', 'proofs', 'category']);

        if($request->has('type')){
            if($type == 'credit'){
                $query->where('debit',0);
            }else if($type == 'debit'){
                $query->where('credit',0);
            }
        }
        
        if ($keyword) {
            $query->whereHas('user', function ($q) use ($keyword) {
                $q->where('first_name', 'like', "%{$keyword}%")
                  ->orWhere('last_name', 'like', "%{$keyword}%")
                  ->orWhere('email', 'like', "%{$keyword}%");
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($userId) {
            $query->where('user_id', $userId);
        }



        $transactions = $query->orderBy('settle_date', 'desc')
                              ->paginate($perPage, ['*'], 'page', $page);

        return response()->json($transactions);
    }
}
