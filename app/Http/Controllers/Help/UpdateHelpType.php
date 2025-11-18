<?php

namespace App\Http\Controllers\Help;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HelpType;

class UpdateHelpType extends Controller
{
    public function __invoke(Request $request, $id)
    {
        $helpType = HelpType::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
            'refund_type' => 'required|in:shared_by_all,by_recipient',
            'refund_amount' => 'required|numeric|min:0',
            'due_days' => 'required|integer|min:1',
            'allowed_limit' => 'nullable|integer|min:1',
        ]);

        $helpType->update($validated);

        return response()->json($helpType);
    }
}
