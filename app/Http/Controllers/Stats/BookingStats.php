<?php

namespace App\Http\Controllers\Stats;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BookingStats extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $year = $request->input('year', now()->year);
        $year = $year === 'all' ? 'all' : (int) $year;

        $startDate = $year !== 'all' ? Carbon::createFromDate($year, 1, 1)->startOfDay() : null;
        $endDate   = $year !== 'all' ? Carbon::createFromDate($year, 12, 31)->endOfDay() : null;

        // Base queries (period scoped)
        $bookingQuery = Booking::query();
        $userQuery    = User::query();

        if ($year !== 'all') {
            $bookingQuery->whereBetween('created_at', [$startDate, $endDate]);
            $userQuery->whereBetween('created_at', [$startDate, $endDate]);
        }

        // Totals in the selected period
        $totalBookings = (clone $bookingQuery)->count();
        $totalNewUsers = (clone $userQuery)->count();

        // Revenue: only PAID bookings, using bookings.amount
        $paidRevenueQuery = (clone $bookingQuery)->where('status', 'paid');
        $totalRevenue = (float) $paidRevenueQuery->sum('amount');

        // Status breakdown
        $statusCounts = (clone $bookingQuery)
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $statusSerie = [
            'pending'   => (int) ($statusCounts['pending'] ?? 0),
            'paid'      => (int) ($statusCounts['paid'] ?? 0),
            'completed' => (int) ($statusCounts['completed'] ?? 0),
        ];

        // Monthly series (only for a specific year)
        $bookingSerie = array_fill(1, 12, 0);
        $userSerie    = array_fill(1, 12, 0);
        $revenueSerie = array_fill(1, 12, 0.0);

        // Monthly status series (pending/paid/completed)
        $monthlyStatusSeries = [
            'pending'   => array_fill(1, 12, 0),
            'paid'      => array_fill(1, 12, 0),
            'completed' => array_fill(1, 12, 0),
        ];

        if ($year !== 'all') {
            // Bookings by month
            $monthlyBookings = (clone $bookingQuery)
                ->selectRaw('MONTH(created_at) as month, COUNT(*) as total')
                ->groupBy('month')
                ->pluck('total', 'month');

            foreach ($monthlyBookings as $month => $count) {
                $bookingSerie[(int) $month] = (int) $count;
            }

            // New users by month
            $monthlyUsers = (clone $userQuery)
                ->selectRaw('MONTH(created_at) as month, COUNT(*) as total')
                ->groupBy('month')
                ->pluck('total', 'month');

            foreach ($monthlyUsers as $month => $count) {
                $userSerie[(int) $month] = (int) $count;
            }

            // Revenue by month (paid only)
            $monthlyRevenue = (clone $paidRevenueQuery)
                ->selectRaw('MONTH(created_at) as month, COALESCE(SUM(amount), 0) as total')
                ->groupBy('month')
                ->pluck('total', 'month');

            foreach ($monthlyRevenue as $month => $amount) {
                $revenueSerie[(int) $month] = (float) $amount;
            }

            // Booking status by month
            $monthlyStatus = (clone $bookingQuery)
                ->selectRaw('MONTH(created_at) as month, status, COUNT(*) as total')
                ->whereIn('status', ['pending', 'paid', 'completed'])
                ->groupBy('month', 'status')
                ->get();

            foreach ($monthlyStatus as $row) {
                $m = (int) $row->month;
                $s = (string) $row->status;
                $monthlyStatusSeries[$s][$m] = (int) $row->total;
            }
        } else {
            // all-time: no monthly arrays
            $bookingSerie = $userSerie = $revenueSerie = [];
            $monthlyStatusSeries = [
                'pending' => [],
                'paid' => [],
                'completed' => [],
            ];
        }

        // Available years (bookings + users only, since revenue comes from bookings now)
        $yearsWithData = DB::table('bookings')
            ->selectRaw('YEAR(created_at) as year')
            ->union(DB::table('users')->selectRaw('YEAR(created_at)'))
            ->whereNotNull('created_at')
            ->orderByDesc('year')
            ->distinct()
            ->pluck('year')
            ->sort()
            ->values()
            ->toArray();

        if (empty($yearsWithData)) {
            $yearsWithData = [now()->year];
        }

        // Extra metrics
        $paidBookingsCount = $statusSerie['paid'];
        $completedBookingsCount = $statusSerie['completed'];

        $averagePaidBookingValue = $paidBookingsCount > 0
            ? round($totalRevenue / $paidBookingsCount, 2)
            : 0;

        $paidRate = $totalBookings > 0
            ? round(($paidBookingsCount / $totalBookings) * 100, 1)
            : 0;

        $completionRate = $totalBookings > 0
            ? round(($completedBookingsCount / $totalBookings) * 100, 1)
            : 0;

        return response()->json([
            'years' => $yearsWithData,
            'scope' => $year === 'all' ? 'all-time' : $year,

            // Totals
            'total_bookings'  => $totalBookings,
            'total_new_users' => $totalNewUsers,
            'total_revenue'   => round($totalRevenue, 2),

            // Status breakdown totals
            'bookings_by_status' => $statusSerie,

            // Series
            'booking_serie'   => array_values($bookingSerie),
            'new_user_serie'  => array_values($userSerie),
            'revenue_serie'   => array_values($revenueSerie),

            // Monthly status series
            'booking_status_series' => [
                'pending'   => array_values($monthlyStatusSeries['pending']),
                'paid'      => array_values($monthlyStatusSeries['paid']),
                'completed' => array_values($monthlyStatusSeries['completed']),
            ],

            'total_pending' => collect(array_values($monthlyStatusSeries['pending']))->sum(),
            'total_paid' => collect(array_values($monthlyStatusSeries['paid']))->sum(),

            // KPIs
            'average_paid_booking_value' => $averagePaidBookingValue,
            'paid_rate'                  => $paidRate,        // % of bookings that are paid
            'completion_rate'            => $completionRate,  // % of bookings completed
            'conversion_rate'            => $totalNewUsers > 0 ? round(($totalBookings / $totalNewUsers) * 100, 1) : 0,
        ]);
    }
}
