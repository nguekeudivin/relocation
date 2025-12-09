<?php

namespace App\Http\Controllers\Slot;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Slot;
use Carbon\Carbon;

class CreateSlot extends Controller
{
    public function __invoke(Request $request, $id)
    {
        // Validate inputs
        $validator = Validator::make($request->all(), [
            'date'        => ['required', 'date'],
            'from_hour'   => ['required'],
            'to_hour'     => ['required'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        // Retrieve slot
        $slot = Slot::findOrFail($id);

        // Rebuild full datetime from date + time
        $from = Carbon::parse($data['date'] . ' ' . $data['from_hour']);
        $to   = Carbon::parse($data['date'] . ' ' . $data['to_hour']);

        // Update slot
        $slot->update([
            'date'        => $data['date'],
            'from_hour'   => $from,
            'to_hour'     => $to,
        ]);

        return response()->json($slot);
        
        
    }
}
