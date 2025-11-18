<?php

namespace App\Http\Controllers\Stats;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Carbon\Carbon;

class UserStats extends Controller
{
    public function __invoke(Request $request)
    {
        $year = $request->input('year', 'all');

        // 🧭 Determine date range
        if ($year !== 'all') {
            $startDate = Carbon::createFromDate($year, 1, 1)->startOfDay();
            $endDate   = Carbon::createFromDate($year, 12, 31)->endOfDay();
            $query = User::whereBetween('created_at', [$startDate, $endDate]);
        } else {
            $query = User::query();
        }

        // 🧮 Compute counts
        $totalUsers     = $query->count();
        $totalActives   = (clone $query)->where('status', 'active')->count();
        $totalInactives = (clone $query)->where('status', 'inactive')->count();
        $totalBanned    = (clone $query)->where('status', 'banned')->count();

        return response()->json([
            'scope'           => $year === 'all' ? 'all-time' : $year,
            'total_users'     => $totalUsers,
            'total_actives'   => $totalActives,
            'total_inactives' => $totalInactives,
            'total_banned'    => $totalBanned,
        ]);
    }
}
