<?php

namespace App\Http\Controllers\Meeting;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Meeting;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class UpdateMeeting extends Controller
{
    public function __invoke(Request $request, $id)
    {
        // ✅ Find the meeting
        $meeting = Meeting::find($id);

        if (! $meeting) {
            return response()->json([
                'message' => 'Réunion introuvable.',
            ], 404);
        }

        // ✅ Validate input
        $validator = Validator::make($request->all(), [
            'user_id'  => 'sometimes|exists:users,id',
            'date'     => 'sometimes|date',
            'location' => 'sometimes|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Données invalides.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            DB::beginTransaction();

            // ✅ Update only provided fields
            $meeting->update($validator->validated());
            $meeting->refresh();

            // ✅ If the date changed, update contributions’ due dates
            if ($meeting->wasChanged('date')) {
                $meeting->contributions()->update(['due_date' => $meeting->date]);
            }

            DB::commit();

            $meeting->load('user');

            return response()->json($meeting);
        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'status'  => 'error',
                'message' => 'Une erreur est survenue lors de la mise à jour de la réunion.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
