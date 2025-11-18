<?php

namespace App\Http\Controllers\Contribution;

use App\Http\Controllers\Controller;
use App\Models\Contribution;

class GetContributionHelp extends Controller
{
    public function __invoke(Contribution $contribution)
    {
        $help = $contribution->helps()->first();

        if (!$help) {
            return response()->json(['message' => 'Aucune entraide associée à cette contribution.'], 404);
        }

        $help->load("user","help_type");


        return response()->json($help, 200);
    }
}
