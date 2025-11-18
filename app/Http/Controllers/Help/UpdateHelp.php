<?php

namespace App\Http\Controllers\Help;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Help;
use Illuminate\Support\Facades\DB;

class UpdateHelp extends Controller
{
    public function __invoke(Request $request, $id)
    {
        $help = Help::findOrFail($id);

        $validated = $request->validate([
            'help_type_id' => 'required|exists:help_types,id',
            'requested_amount' => 'required|numeric|min:0',
            'approved_amount' => 'nullable|numeric|min:0',
            'status' => 'required|in:pending,approved,rejected,paid',
            'request_date' => 'required|date',
        ]);
        
        DB::beginTransaction();

        $help->update($validated);
        if ($help->status === 'approved') {
            $help->createContributions($help->help_type_id);
        }

        DB::commit();
        $help->load(['user', 'help_type', 'transactions.proofs', 'transactions.financial_account']);

        return response()->json($help);
    }
}
