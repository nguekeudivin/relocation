<?php

namespace App\Http\Controllers\Contribution;

use App\Http\Controllers\Controller;
use App\Models\Contribution;

class GetContributionMeeting extends Controller
{
    public function __invoke(Contribution $contribution)
    {
        $meeting = $contribution->meetings()->first();

        if (!$meeting) {
            return response()->json(['message' => 'Aucune réunion associée à cette contribution.'], 404);
        }

        $meeting->load("user","host");

        return response()->json($meeting, 200);
    }
}
