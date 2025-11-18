<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FinanceAccount;
use Illuminate\Support\Facades\DB;

class CreateFinanceAccount extends Controller
{
    public function __invoke(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:orange_money,mtn_momo,bank,cash',
            'phone_number' => 'nullable|string|max:20',
            'bank_name' => 'nullable|string|max:255',
            'account_number' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $account = FinanceAccount::create($validated);

        $account->load('user');

        return response()->json($account, 201);
    }
}
