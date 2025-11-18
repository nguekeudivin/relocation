<?php

namespace App\Http\Controllers\Stats;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Contribution;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ContributionStats extends Controller
{
    public function __invoke(Request $request)
    {
        $year = $request->input('year', 'all');

        // === 0️⃣ Base query (optionally restricted to a year) ===
        $baseQuery = Contribution::query();

        if ($year !== 'all') {
            $startDate = Carbon::createFromDate($year)->startOfYear();
            $endDate   = Carbon::createFromDate($year)->endOfYear();
            $baseQuery->whereBetween('created_at', [$startDate, $endDate]);
        }

        // === 1️⃣ Totals by status (count + sum) ===
        $statusStats = $baseQuery->clone()
            ->select(
                'status',
                DB::raw('COUNT(*) as count'),
                DB::raw('COALESCE(SUM(amount), 0) as total')
            )
            ->groupBy('status')
            ->get()
            ->keyBy('status');

        $statuses = ['pending', 'paid', 'overdue'];
        $totals = [];
        foreach ($statuses as $s) {
            $totals[$s] = [
                'count' => (int) ($statusStats[$s]->count ?? 0),
                'total' => (float) ($statusStats[$s]->total ?? 0),
            ];
        }

        // === 2️⃣ Monthly repartition for "paid" and "overdue" ===

        // Paid amounts
        $paidMonthly = $baseQuery->clone()
            ->select(
                DB::raw('MONTH(payment_date) as month'),
                DB::raw('SUM(amount) as total')
            )
            ->where('status', 'paid')
            ->whereNotNull('payment_date')
            ->groupBy('month')
            ->get();

        // Overdue amounts
        $overdueMonthly = $baseQuery->clone()
            ->select(
                DB::raw('MONTH(due_date) as month'),
                DB::raw('SUM(amount) as total')
            )
            ->where('status', 'overdue')
            ->whereNotNull('due_date')
            ->groupBy('month')
            ->get();

        // Paid counts
        $paidCountMonthly = $baseQuery->clone()
            ->select(
                DB::raw('MONTH(payment_date) as month'),
                DB::raw('COUNT(*) as total')
            )
            ->where('status', 'paid')
            ->whereNotNull('payment_date')
            ->groupBy('month')
            ->get();

        // Overdue counts
        $overdueCountMonthly = $baseQuery->clone()
            ->select(
                DB::raw('MONTH(due_date) as month'),
                DB::raw('COUNT(*) as total')
            )
            ->where('status', 'overdue')
            ->whereNotNull('due_date')
            ->groupBy('month')
            ->get();

        // Initialize series (Jan–Dec)
        $paids = array_fill(1, 12, 0);
        $paidCounts = array_fill(1, 12, 0);
        $overdues = array_fill(1, 12, 0);
        $overdueCounts = array_fill(1, 12, 0);

        foreach ($paidMonthly as $row) {
            $paids[$row->month] = (float) $row->total;
        }
        foreach ($paidCountMonthly as $row) {
            $paidCounts[$row->month] = (int) $row->total;
        }
        foreach ($overdueMonthly as $row) {
            $overdues[$row->month] = (float) $row->total;
        }
        foreach ($overdueCountMonthly as $row) {
            $overdueCounts[$row->month] = (int) $row->total;
        }

        // === 3️⃣ Contributions created monthly ===

        // Count of created contributions per month
        $createdCountMonthly = $baseQuery->clone()
            ->select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('month')
            ->get();

        // Total amount of contributions created per month
        $createdAmountMonthly = $baseQuery->clone()
            ->select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('SUM(amount) as total')
            )
            ->groupBy('month')
            ->get();

        $createdCountSerie = array_fill(1, 12, 0);
        $createdSerie = array_fill(1, 12, 0);

        foreach ($createdCountMonthly as $row) {
            $createdCountSerie[$row->month] = (int) $row->total;
        }
        foreach ($createdAmountMonthly as $row) {
            $createdSerie[$row->month] = (float) $row->total;
        }

        // === 4️⃣ Repartition by contribution type ===
        $typeData = $baseQuery->clone()
            ->select('type', DB::raw('SUM(amount) as total'))
            ->groupBy('type')
            ->pluck('total', 'type');

        $types = ['adhesion', 'monthly', 'meeting_support', 'help_refund'];
        $typeRepartition = [];
        foreach ($types as $t) {
            $typeRepartition[$t] = (float) ($typeData[$t] ?? 0);
        }

        // === ✅ Return Statistics ===
        return response()->json([
            'scope' => $year === 'all' ? 'all-time' : $year,

            // Totals by status
            'total_paid'           => $totals['paid']['count'],
            'total_pending'        => $totals['pending']['count'],
            'total_overdue'        => $totals['overdue']['count'],

            // Amounts by status
            'total_paid_amount'    => $totals['paid']['total'],
            'total_pending_amount' => $totals['pending']['total'],
            'total_overdue_amount' => $totals['overdue']['total'],

            // Monthly trends
            'paid_serie'           => array_values($paids),
            'paid_count_serie'     => array_values($paidCounts),
            'overdue_serie'        => array_values($overdues),
            'overdue_count_serie'  => array_values($overdueCounts),
            'created_count_serie'  => array_values($createdCountSerie),
            'created_serie'        => array_values($createdSerie),

            // Repartition by type
            'contribution_repartition' => $typeRepartition,
        ]);
    }
}
