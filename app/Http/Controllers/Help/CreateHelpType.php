<?php

namespace App\Http\Controllers\Help;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HelpType;

class CreateHelpType extends Controller
{
    public function __invoke(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
            'refund_type' => 'required|in:shared_by_all,by_recipient',
            'refund_amount' => 'required|numeric|min:0',
            'due_days' => 'required|integer|min:1',
            'allowed_limit' => 'nullable|integer|min:1',
        ]);

        $helpType = HelpType::create($validated);

        return response()->json($helpType, 201);
    }
}
