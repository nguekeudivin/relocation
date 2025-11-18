<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class CancelTransaction extends Controller
{
    public function __invoke(Request $request, Transaction $transaction)
    {
        DB::beginTransaction();

        try {
            // Update original transaction status
            $transaction->status = 'canceled';
            $transaction->save();

            // Prepare reversed transaction data
            $data = [
                'name' => 'Annulation de ' . $transaction->name,
                'user_id' => $transaction->user_id,
                'status' => 'completed',
                'settle_date' => now(),
                'financial_account_id' => $transaction->financial_account_id,
                'description' => 'Transaction d\'annulation de la transaction #' . $transaction->id,
            ];

            // Invert the credit/debit
            if ($transaction->debit == 0) {
                $data['credit'] = 0;
                $data['debit'] = $transaction->credit;
            } else {
                $data['debit'] = 0;
                $data['credit'] = $transaction->debit;
            }

            // Create reversed transaction
            $reversed = Transaction::create($data);

            DB::commit();

            return response()->json($transaction, 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Une erreur est survenue lors de l\'annulation.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
