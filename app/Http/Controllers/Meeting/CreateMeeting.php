<?php

namespace App\Http\Controllers\Meeting;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Meeting;
use App\Models\User;
use App\Models\Setting;
use App\Models\Contribution;
use App\Models\MeetingContribution;

class CreateMeeting extends Controller
{
    public function __invoke(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id'  => 'required|exists:users,id',
            'date'     => 'required|date',
            'location' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid data provided',
                'errors'  => $validator->errors(),
            ], 422);
        }

        // ✅ Create meeting
        $user = User::find($request->user_id);
        $meeting = Meeting::create([
            'user_id'  => $request->user_id,
            'date'     => $request->date,
            'location' => $request->has('location') ? $request->location : $user->address
        ]);

        // ✅ Retrieve active users and contribution setting
        $users = User::where('status', 'active')->get();
        $setting = Setting::where('code', 'meeting_support_amount')->first();
        $amount = $setting ? (float) $setting->value : 0;

        foreach ($users as $user) {
            // Check if this user already has a contribution for this meeting
            $exists = MeetingContribution::where('user_id', $user->id)
                ->where('meeting_id', $meeting->id)
                ->exists();

            if (!$exists) {
                // Create the contribution
                $contribution = Contribution::create([
                    'user_id'      => $user->id,
                    'amount'       => $amount,
                    'type'         => 'meeting_support',
                    'status'       => 'pending',
                    'due_date'     => $request->date,
                ]);

                // Link it to the meeting
                MeetingContribution::create([
                    'user_id'         => $user->id,
                    'meeting_id'      => $meeting->id,
                    'contribution_id' => $contribution->id,
                ]);
            }
        }

        $meeting->load('user');

        return response()->json($meeting, 201);
    }
}
