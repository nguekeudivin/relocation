<?php

namespace App\Http\Controllers\Contribution;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class GetContributionAmount extends Controller
{
    public function __invoke(Request $request)
    {
        // ✅ Validate inputs
        $validator = Validator::make($request->all(), [
            'type' => 'required|in:adhesion,monthly,meeting_support,help_refund',
            'help_type_id' => 'nullable|integer|exists:help_types,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Paramètres invalides.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $type = $request->type;
        $helpTypeId = $request->help_type_id;
        $amount = null;

        switch ($type) {
            case 'adhesion':
                $amount = DB::table('settings')
                    ->where('code', 'adhesion_contribution_amount')
                    ->value('value');
                break;

            case 'monthly':
                $amount = DB::table('settings')
                    ->where('code', 'monthly_contribution_amount')
                    ->value('value');
                break;

            case 'meeting_support':
                $amount = DB::table('settings')
                    ->where('code', 'meeting_support_amount')
                    ->value('value');
                break;

            case 'help_refund':
                if (! $helpTypeId) {
                    return response()->json([
                        'message' => "Le paramètre 'help_type_id' est requis pour le type 'help_refund'.",
                    ], 400);
                }

                $helpType = DB::table('help_types')->find($helpTypeId);

                if (! $helpType) {
                    return response()->json([
                        'message' => "Type d'aide introuvable.",
                    ], 404);
                }

                $amount = $helpType->refund_amount;
                break;
        }

        if (! $amount) {
            return response()->json([
                'message' => 'Aucun montant configuré pour ce type de contribution.',
            ], 404);
        }

        return response()->json([
            'type' => $type,
            'amount' => (float) $amount,
        ]);
    }
}
    