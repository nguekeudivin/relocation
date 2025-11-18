<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\Asset;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class UpdateTransaction extends Controller
{
    public function __invoke(Request $request, $id)
    {
        $transaction = Transaction::findOrFail($id);

        // Validate request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:pending,completed,failed,overdue',
            'financial_account_id' => 'required|exists:finance_accounts,id',
            'category_id' => 'nullable|exists:categories,id',
            // Handling proofs.
            'proof_count' => 'nullable|numeric',
            'proofs_to_remove' => 'nullable'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        DB::beginTransaction();

        try {
            // Update allowed fields
            $transaction->update([
                'name' => $data['name'],
                'description' => $data['description'] ?? $transaction->description,
                'status' => $data['status'],
                 'financial_account_id' => $data['financial_account_id'],
                'category_id' => $data['category_id']
            ]);

            // Remove proofs that need to be remove.
            if($request->has('proofs_to_remove')){
                foreach($data['proofs_to_remove'] as $proofId){
                    Asset::find($proofId)->delete();
                }
            }

            // Handle new proof uploads
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

            return response()->json($transaction, 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Une erreur est survenue lors de la mise à jour de la transaction.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
