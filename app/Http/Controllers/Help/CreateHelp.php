<?php

namespace App\Http\Controllers\Help;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Help;
use App\Models\User;
use App\Models\HelpType;
use App\Models\Contribution;
use App\Models\HelpContribution;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CreateHelp extends Controller
{
    public function __invoke(Request $request)
    {
        //$user = Auth::user();

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'help_type_id' => 'required|exists:help_types,id',
            'requested_amount' => 'required|numeric|min:0',
            'approved_amount' => 'nullable|numeric|min:0',
            'status' => 'required|in:pending,approved,rejected',
            'request_date' => 'required|date',
        ]);

        DB::beginTransaction();

        $help = Help::create([
            'user_id' => $validated['user_id'],
            'help_type_id' => $validated['help_type_id'],
            'requested_amount' => $validated['requested_amount'],
            'approved_amount' => $validated['approved_amount'],
            'status' => $validated['status'],
            'request_date' => $validated['request_date'],
        ]);

        if ($help->status === 'approved') {
            //$help->approved_by = $user->id;
            $help->createContributions($validated['help_type_id']);
        }

        DB::commit();

        $help->load(['user', 'help_type']);

        return response()->json($help, 201);
    }
}
