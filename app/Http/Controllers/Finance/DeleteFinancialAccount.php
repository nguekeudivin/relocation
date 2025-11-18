<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FinanceAccount;
use App\Models\Transaction;

class DeleteFinanceAccount extends Controller
{
    public function __invoke(Request $request,FinanceAccount $FinanceAccount){
        $temp = $FinanceAccount->toArray();
        $transaction = Transaction::where("financial_account_id", $FinanceAccount->id)->first();
        if($transaction != null){
            return response()->json(['message' => "Ce compte ne peut etre supprimer. Des transactions financiere sont enregistrees pour ce compte"],422);
        }else{
            $FinanceAccount->delete();
            return response()->json($temp);
        }
    }
}
