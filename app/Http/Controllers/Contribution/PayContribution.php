<?php

namespace App\Http\Controllers\Contribution;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Contribution;
use App\Models\Transaction;
use App\Models\Asset;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Notifications\ContributionTransactionPaidNotification;

class PayContribution extends Controller
{
    public function __invoke(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'contribution_id' => 'required|exists:contributions,id',
            'amount' => 'required|numeric',
            'financial_account_id' => 'required|exists:finance_accounts,id',
            'proof_count' => 'nullable|numeric',
            'payment_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        $contribution = Contribution::findOrFail($data['contribution_id']);
        
        DB::beginTransaction();

        try {
            $transaction =  $contribution->transactions()->create([
                'credit' => $data['amount'],
                'debit' => 0,
                'status' => 'completed',
                'due_date' => $contribution->due_date,
                'settle_date' => $data['payment_date'],
                'description' => 'Transaction pour le paiement de la contribution ID: ' . $contribution->id,
                'financial_account_id' => $data['financial_account_id'],
            ]);

            if (isset($data['proof_count']) && (int)$data['proof_count'] >= 1) {
                foreach (range(1, (int)$data['proof_count']) as $i) {
                    if ($request->hasFile('proof_' . $i)) {
                        $transaction->proofs()->create(
                            Asset::makePublic($request->file('proof_' . $i), 'transactions', 'proof')
                        );
                    }
                }
            }   

            // If the sum of all transactions are greater than the transaction amount we can then say we
            // have paid the transaction.
            if((integer)$contribution->transactions->sum('credit') >= (integer)$contribution->amount){
                $contribution->status = 'paid';
                $contribution->payment_date = $data['payment_date'];
                $contribution->save();
            }else{
                $contribution->status = 'pending';
                $contribution->payment_date = null;
                $contribution->save();
            }

            DB::commit();
            $contribution->load('transactions.financial_account', 'transactions.proofs','user');

            // Trigger the notification.
            $transaction->load('payable.user'); 
            $users = User::where('status', 'active')->get();
            
            $user = $users[0];
            $user->notify(new ContributionTransactionPaidNotification($transaction));
            // foreach ($users as $user) {
            //     $user->notify(new ContributionTransactionPaidNotification($transaction));
            // }
            return response()->json($contribution, 201);
        } catch (\Exception $e) {
            DB::rollBack();

            dump($e);

            return response()->json([
                'message' => 'Une erreur est survenue lors du paiement.',
            ], 500);
        }
    }
}
