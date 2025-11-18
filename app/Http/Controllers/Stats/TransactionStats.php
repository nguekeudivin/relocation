<?php

namespace App\Http\Controllers\Stats;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\Contribution;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class TransactionStats extends Controller
{
    public function __invoke(Request $request)
    {
        $year = $request->input('year', 'all');

        // === 1️⃣ Define start and end dates safely ===
        $startDate = $year !== 'all' ? Carbon::createFromDate($year)->startOfYear() : null;
        $endDate   = $year !== 'all' ? Carbon::createFromDate($year)->endOfYear() : null;

        // === 2️⃣ Base transactions query ===
        $baseQuery = Transaction::query();
        if ($year !== 'all') {
            $baseQuery->whereBetween('transactions.created_at', [$startDate, $endDate]);
        }

        // === 3️⃣ Total expenses (debits only) ===
        $totalExpenses = $baseQuery->clone()
            ->where('transactions.credit', 0)
            ->sum('transactions.debit');

        // === 4️⃣ Total incomes from contributions ===
        $incomeContributionTypes = ['adhesion', 'monthly', 'help_refund'];

        $incomeAmount = Contribution::query()
            ->whereIn('type', $incomeContributionTypes)
            ->where('status', 'paid')
            ->when($year !== 'all', function ($q) use ($startDate, $endDate) {
                $q->whereBetween('payment_date', [$startDate, $endDate]);
            })
            ->sum('amount');

        // === 5️⃣ Monthly expense series ===
        $monthlyExpenses = $baseQuery->clone()
            ->select(
                DB::raw('MONTH(transactions.created_at) as month'),
                DB::raw('SUM(transactions.debit) as total')
            )
            ->where('transactions.credit', 0)
            ->groupBy('month')
            ->get();

        $expenseSerie = array_fill(1, 12, 0);
        foreach ($monthlyExpenses as $row) {
            $expenseSerie[$row->month] = (float) $row->total;
        }

        // === 6️⃣ Monthly income series (from contributions) ===
        $monthlyIncomes = Contribution::query()
            ->select(
                DB::raw('MONTH(payment_date) as month'),
                DB::raw('SUM(amount) as total')
            )
            ->whereIn('type', $incomeContributionTypes)
            ->where('status', 'paid')
            ->when($year !== 'all', function ($q) use ($startDate, $endDate) {
                $q->whereBetween('payment_date', [$startDate, $endDate]);
            })
            ->groupBy('month')
            ->get();

        $incomeSerie = array_fill(1, 12, 0);
        foreach ($monthlyIncomes as $row) {
            $incomeSerie[$row->month] = (float) $row->total;
        }

        // === 7️⃣ Expense repartition by financial account (names) ===
        $expenseRepartition = $baseQuery->clone()
            ->where('transactions.credit', 0)
            ->join('finance_accounts', 'transactions.financial_account_id', '=', 'finance_accounts.id')
            ->select('finance_accounts.name', DB::raw('SUM(transactions.debit) as total'))
            ->groupBy('finance_accounts.name')
            ->pluck('total', 'finance_accounts.name');

        // === 8️⃣ Balance calculation ===
        $totalCredits = $baseQuery->clone()->sum('transactions.credit');
        $totalDebits  = $baseQuery->clone()->sum('transactions.debit');
        $balance = $totalCredits - $totalDebits;

        // === 9️⃣ Balance repartition by financial account (names) ===
        $balanceRepartition = $baseQuery->clone()
            ->join('finance_accounts', 'transactions.financial_account_id', '=', 'finance_accounts.id')
            ->select(
                'finance_accounts.name',
                DB::raw('SUM(transactions.credit) - SUM(transactions.debit) as balance')
            )
            ->groupBy('finance_accounts.name')
            ->pluck('balance', 'finance_accounts.name');

        // === ✅ Return JSON ===
        return response()->json([
            'scope' => $year === 'all' ? 'all-time' : $year,

            // Totals
            'total_expenses' => $totalExpenses,
            'total_incomes'  => $incomeAmount,
            'balance'        => $balance,

            // Monthly series
            'expense_serie' => array_values($expenseSerie),
            'income_serie'  => array_values($incomeSerie),

            // Repartition
            'expense_repartition' => $expenseRepartition,
            'balance_repartition' => $balanceRepartition,
        ]);
    }
}
