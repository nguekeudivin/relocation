<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\Asset;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CreateTransaction extends Controller
{
    public function __invoke(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'user_id' => 'nullable|exists:users,id',
            'credit' => 'required|numeric|min:0',
            'debit' => 'required|numeric|min:0',
            'status' => 'required|in:pending,completed,failed,overdue',
            'settle_date' => 'required|date',
            'financial_account_id' => 'required|exists:finance_accounts,id',
            'category_id' => 'nullable|exists:categories,id',
            'proof_count' => 'nullable|numeric',
            'name' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        DB::beginTransaction();

        try {
            // Create the transaction
            $transaction = Transaction::create([
                'name' => $data['name'],
                'credit' => $data['credit'],
                'debit' => $data['debit'],
                'status' => $data['status'],
                'settle_date' => $data['settle_date'],
                'financial_account_id' => $data['financial_account_id'],
                'category_id' => $data['category_id']
            ]);

            if($request->has('user_id')){
                $transaction->user_id = $request->user_id;
                $transaction->save();
            }

            // Handle proof uploads if provided
            if (isset($data['proof_count']) && (int)$data['proof_count'] >= 1) {
                foreach (range(1, (int)$data['proof_count']) as $i) {
                    if ($request->hasFile('proof_' . $i)) {
                        $transaction->proofs()->create(
                            Asset::makePublic($request->file('proof_' . $i), 'transactions', 'proof')
                        );
                    }
                }
            }

            DB::commit();

            // Load relations for response
            $transaction->load(['user', 'financial_account', 'proofs']);

            return response()->json($transaction, 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Une erreur est survenue lors de la création de la transaction.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
