<?php 

namespace App\Http\Controllers\Stats;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Help;
use App\Models\Transaction;
use App\Models\HelpType; // Make sure this model exists
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class HelpStats extends Controller
{
    public function __invoke(Request $request)
    {
        $year = $request->input('year', 'all');

        // Base query
        $baseQuery = Help::query();

        if ($year !== 'all') {
            $startDate = Carbon::createFromDate($year)->startOfYear();
            $endDate   = Carbon::createFromDate($year)->endOfYear();
            $baseQuery->whereBetween('created_at', [$startDate, $endDate]);
        }

        // === 1️⃣ Totals by status ===
        $statusStats = $baseQuery->clone()
            ->select(
                'status',
                DB::raw('COUNT(*) as count'),
                DB::raw('COALESCE(SUM(CASE WHEN approved_amount IS NOT NULL THEN approved_amount ELSE requested_amount END), 0) as total')
            )
            ->groupBy('status')
            ->get()
            ->keyBy('status');

        $statuses = ['pending', 'approved', 'rejected', 'paid'];
        $totals = [];
        foreach ($statuses as $s) {
            $totals[$s] = [
                'count' => (int) ($statusStats[$s]->count ?? 0),
                'total' => (float) ($statusStats[$s]->total ?? 0),
            ];
        }

        // === 2️⃣ Total debit in transactions related to helps ===
        $totalAmount = Transaction::where('payable_type', Help::class)
            ->sum('debit');

        // === 3️⃣ Total helps that are approved or paid ===
        $totalHelps = Help::whereIn('status', ['approved', 'paid'])->count();

        // === 4️⃣ Help repartition by help type name ===
        $helpRepartitionRaw = $baseQuery->clone()
            ->select('help_type_id', DB::raw('SUM(COALESCE(approved_amount, requested_amount)) as total'))
            ->groupBy('help_type_id')
            ->get();

        // Get all help types for mapping
        $helpTypes = HelpType::pluck('name', 'id'); // [id => name]

        $helpRepartition = [];
        foreach ($helpRepartitionRaw as $row) {
            $helpRepartition[$helpTypes[$row->help_type_id] ?? "Unknown"] = (float) $row->total;
        }

        // === 5️⃣ Monthly evolution (help_serie) ===
        $helpSerie = array_fill(1, 12, 0);
        $monthly = $baseQuery->clone()
            ->select(
                DB::raw('MONTH(approved_at) as month'),
                DB::raw('SUM(COALESCE(approved_amount, requested_amount)) as total')
            )
            ->whereIn('status', ['approved', 'paid'])
            ->whereNotNull('approved_at')
            ->groupBy('month')
            ->get();

        foreach ($monthly as $row) {
            $helpSerie[$row->month] = (float) $row->total;
        }

        // === ✅ Final JSON Response ===
        return response()->json([
            'scope' => $year === 'all' ? 'all-time' : $year,

            // Counts by status
            'total_pending'  => $totals['pending']['count'],
            'total_approved' => $totals['approved']['count'],
            'total_rejected' => $totals['rejected']['count'],
            'total_paid'     => $totals['paid']['count'],

            // Amounts by status
            'total_pending_amount'  => $totals['pending']['total'],
            'total_approved_amount' => $totals['approved']['total'],
            'total_rejected_amount' => $totals['rejected']['total'],
            'total_paid_amount'     => $totals['paid']['total'],

            // Global totals
            'total_amount' => $totalAmount,
            'total_helps'  => $totalHelps,

            // Distributions
            'help_serie'       => array_values($helpSerie),
            'help_repartition' => $helpRepartition,
        ]);
    }
}
