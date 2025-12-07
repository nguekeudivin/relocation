<?php

namespace App\Http\Controllers\Stats;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
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

        // Période sélectionnée
        $startDate = $year !== 'all' ? Carbon::createFromDate($year, 1, 1)->startOfDay() : null;
        $endDate   = $year !== 'all' ? Carbon::createFromDate($year, 12, 31)->endOfDay() : null;

        // === Requêtes de base filtrées par période ===
        $bookingQuery = Booking::query();
        $paymentQuery = Payment::query()->where('status', 'completed');
        $userQuery    = User::query();

        if ($year !== 'all') {
            $bookingQuery->whereBetween('created_at', [$startDate, $endDate]);
            $paymentQuery->whereBetween('created_at', [$startDate, $endDate]);
            $userQuery   ->whereBetween('created_at', [$startDate, $endDate]);
        }

        // === 1. Totaux de la période sélectionnée ===
        $totalBookings = (clone $bookingQuery)->count();
        $totalNewUsers = (clone $userQuery)->count();           // utilisateurs créés pendant la période
        $totalRevenue  = (clone $paymentQuery)->sum('amount');

        // === 2. Séries mensuelles – uniquement si on est sur une année précise ===
        $bookingSerie = array_fill(1, 12, 0);
        $userSerie    = array_fill(1, 12, 0);
        $revenueSerie = array_fill(1, 12, 0.0);

        if ($year !== 'all') {
            // Bookings par mois
            $monthlyBookings = (clone $bookingQuery)
                ->selectRaw('MONTH(created_at) as month, COUNT(*) as total')
                ->groupBy('month')
                ->pluck('total', 'month');
            foreach ($monthlyBookings as $month => $count) {
                $bookingSerie[$month] = (int) $count;
            }

            // Nouveaux utilisateurs par mois
            $monthlyUsers = (clone $userQuery)
                ->selectRaw('MONTH(created_at) as month, COUNT(*) as total')
                ->groupBy('month')
                ->pluck('total', 'month');
            foreach ($monthlyUsers as $month => $count) {
                $userSerie[$month] = (int) $count;
            }

            // Revenu par mois
            $monthlyRevenue = (clone $paymentQuery)
                ->selectRaw('MONTH(created_at) as month, COALESCE(SUM(amount), 0) as total')
                ->groupBy('month')
                ->pluck('total', 'month');
            foreach ($monthlyRevenue as $month => $amount) {
                $revenueSerie[$month] = (float) $amount;
            }
        } else {
            // Mode "all-time" → on ne peut pas faire de série mensuelle sur toutes les années
            // On retourne quand même des tableaux vides ou on pourrait faire par année, mais ce n’est pas l’objet ici
            $bookingSerie = $userSerie = $revenueSerie = [];
        }

        // === 1. Récupérer les années disponibles (une seule requête intelligente) ===
        $yearsWithData = DB::table('bookings')
            ->selectRaw('YEAR(created_at) as year')
            ->union(DB::table('payments')->selectRaw('YEAR(created_at)'))
            ->union(DB::table('users')->selectRaw('YEAR(created_at)'))
            ->whereNotNull('created_at')
            ->orderByDesc('year')
            ->distinct()
            ->pluck('year')
            ->sort()
            ->values()
            ->toArray();

        // Si pas de données du tout, on met l’année courante par défaut
        if (empty($yearsWithData)) {
            $yearsWithData = [now()->year];
        }

        // === Retour final – tout cohérent avec la période ===
        return response()->json([

            'years' => $yearsWithData,

            'scope' => $year === 'all' ? 'all-time' : $year,

            // Totaux de la période
            'total_bookings'       => $totalBookings,
            'total_new_users'      => $totalNewUsers,        // créé pendant la période
            'total_revenue'        => round($totalRevenue, 2),

            // Séries (uniquement si année sélectionnée)
            'booking_serie'        => array_values($bookingSerie),
            'new_user_serie'       => array_values($userSerie),
            'revenue_serie'        => array_values($revenueSerie),

            // Bonus utiles
            'average_booking_value' => $totalBookings > 0 ? round($totalRevenue / $totalBookings, 2) : 0,
            'conversion_rate'       => $totalNewUsers > 0 ? round(($totalBookings / $totalNewUsers) * 100, 1) : 0,
        ]);
    }
}