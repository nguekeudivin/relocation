<?php

namespace App\Http\Controllers\Contribution;

use App\Http\Controllers\Controller;
use App\Models\Contribution;
use App\Models\Help;
use App\Models\HelpContribution;
use App\Models\Meeting;
use App\Models\MeetingContribution;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class UpdateContribution extends Controller
{
    public function __invoke(Request $request, Contribution $contribution)
    {
        $validator = Validator::make($request->all(), [
            'user_id'    => ['required', 'exists:users,id'],
            'amount'     => ['required', 'numeric', 'min:0'],
            'type'       => ['required', 'in:adhesion,monthly,meeting_support,help_refund'],
            'due_date'   => ['required', 'date'],
            'help_id'    => ['nullable', 'exists:helps,id'],
            'meeting_id' => ['nullable', 'exists:meetings,id'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        DB::beginTransaction();

        try {
            // Always clear old relationships to reassign properly
            HelpContribution::where('contribution_id', $contribution->id)->delete();
            MeetingContribution::where('contribution_id', $contribution->id)->delete();

            // Validate and check uniqueness for help_refund
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
                    ->whereHas('contribution', fn($q) =>
                        $q->where('user_id', $data['user_id'])
                          ->where('id', '!=', $contribution->id)
                    )->exists();

                if ($exists) {
                    return response()->json(['message' => 'Une contribution existe déjà pour cet utilisateur et cette entraide.'], 422);
                }
            }

            // Validate and check uniqueness for meeting_support
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
                    ->where('contribution_id', '!=', $contribution->id)
                    ->exists();

                if ($exists) {
                    return response()->json(['message' => 'Une contribution existe déjà pour cet utilisateur et cette réunion.'], 422);
                }
            }

            // Apply basic update
            $contribution->update([
                'user_id'  => $data['user_id'],
                'amount'   => $data['amount'],
                'type'     => $data['type'],
                'due_date' => $data['due_date'],
            ]);

            // Recreate the appropriate link
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

            DB::commit();

            return response()->json($contribution);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de la mise à jour de la contribution.',
            ], 500);
        }
    }
}
