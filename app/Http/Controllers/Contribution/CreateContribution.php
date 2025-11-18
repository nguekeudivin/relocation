<?php

namespace App\Http\Controllers\Contribution;

use App\Http\Controllers\Controller;
use App\Models\Contribution;
use App\Models\Help;
use App\Models\HelpContribution;
use App\Models\Meeting;
use App\Models\MeetingContribution;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CreateContribution extends Controller
{
    public function __invoke(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id'       => ['required', 'exists:users,id'],
            'amount'        => ['required', 'numeric', 'min:0'],
            'type'          => ['required', 'in:adhesion,monthly,meeting_support,help_refund'],
            'due_date'      => ['required', 'date'],
            'help_id'       => ['nullable', 'exists:helps,id'],
            'meeting_id'    => ['nullable', 'exists:meetings,id'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        // Validation pour les types spécifiques
        if ($data['type'] === 'help_refund') {
            if (!isset($data['help_id'])) {
                return response()->json([
                    'message' => 'L\'identifiant de l\'entraide (help_id) est requis pour les contributions de type help_refund.'
                ], 422);
            }

            $help = Help::find($data['help_id']);

            if (!$help) {
                return response()->json(['message' => 'L\'entraide spécifiée est introuvable.'], 404);
            }

            $exists = HelpContribution::where('help_id', $help->id)
                ->whereHas('contribution', fn($q) => $q->where('user_id', $data['user_id']))
                ->exists();

            if ($exists) {
                return response()->json(['message' => 'Une contribution existe déjà pour cet utilisateur et cette entraide.'], 422);
            }
        }

        if ($data['type'] === 'meeting_support') {
            if (!isset($data['meeting_id'])) {
                return response()->json([
                    'message' => 'L\'identifiant de la réunion (meeting_id) est requis pour les contributions de type meeting_support.'
                ], 422);
            }

            $meeting = Meeting::find($data['meeting_id']);

            if (!$meeting) {
                return response()->json(['message' => 'La réunion spécifiée est introuvable.'], 404);
            }

            $exists = MeetingContribution::where('meeting_id', $meeting->id)
                ->where('user_id', $data['user_id'])
                ->exists();

            if ($exists) {
                return response()->json(['message' => 'Une contribution existe déjà pour cet utilisateur et cette réunion.'], 422);
            }
        }

        // Création de la contribution
        $contribution = Contribution::create([
            'user_id' => $data['user_id'],
            'amount'  => $data['amount'],
            'type'    => $data['type'],
            'due_date'=> $data['due_date'],
        ]);

        // Liaison avec l'entraide ou la réunion si nécessaire
        if ($data['type'] === 'help_refund') {
            HelpContribution::create([
                'help_id'        => $data['help_id'],
                'contribution_id'=> $contribution->id,
            ]);
        }

        if ($data['type'] === 'meeting_support') {
            MeetingContribution::create([
                'user_id'        => $data['user_id'],
                'meeting_id'     => $data['meeting_id'],
                'contribution_id'=> $contribution->id,
            ]);
        }

        $contribution->refresh();

        $contribution->load('user');

        return response()->json($contribution, 201);
    }
}
