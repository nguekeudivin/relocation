<?php

namespace App\Http\Controllers\Help;

use App\Http\Controllers\Controller;
use App\Models\Help;
use App\Models\Asset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PayHelp extends Controller
{
    public function __invoke(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'debit' => 'required|numeric',
            'help_id' => 'required|exists:helps,id',
            'financial_account_id' => 'required|exists:finance_accounts,id',
            'settle_date' => 'required|date',
            'proof_count' => 'nullable|integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        $help = Help::findOrFail($data['help_id']);

        DB::beginTransaction();

        try {
            $transaction = $help->transactions()->create([
                'debit' => $data['debit'],
                'credit' => 0,
                'status' => 'completed',
                'settle_date' => $data['settle_date'],
                'description' => "Transaction pour le paiement de l'aide contribution ID: {$help->id}",
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

            if ((int)$help->transactions->sum('debit') >= (int)$help->approved_amount) {
                $help->status = 'paid';
            } else {
                $help->status = 'approved';
            }
            $help->save();

            DB::commit();

            $help->load('user', 'transactions.proofs', 'help_type' ,'transactions.financial_account');

            return response()->json($help, 201);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error($e);
            return response()->json([
                'message' => 'Une erreur est survenue lors du paiement.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
