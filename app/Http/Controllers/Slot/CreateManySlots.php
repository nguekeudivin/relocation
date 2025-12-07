<?php

namespace App\Http\Controllers\Slot;

use App\Http\Controllers\Controller;
use App\Models\Slot;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Carbon\CarbonPeriod;

class CreateManySlots extends Controller
{
    public function __invoke(Request $request)
    {
        $validated = $request->validate([
            'start_date' => ['required', ],
            'end_date'   => ['required', 'after_or_equal:start_date'],
        ]);

        $startDate = Carbon::parse($validated['start_date']);
        $endDate   = Carbon::parse($validated['end_date']);

        // Génère une période de dates
        $period = CarbonPeriod::create($startDate, $endDate);

        $slots = [];

        foreach ($period as $date) {
            $slots[] = [
                'date'        => $date->toDateString(),
                'from_hour'   => $date->copy()->setTime(8, 0),
                'to_hour'     => $date->copy()->setTime(18, 0),
                'created_at'  => now(),
                'updated_at'  => now(),
            ];
        }

        // Insertion en bulk
        Slot::insert($slots);

        return response()->json([
            'message' => 'Slots created successfully',
            'count'   => count($slots),
        ]);
    }
}
