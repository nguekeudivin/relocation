<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\Setting;
use Carbon\Carbon;

class GenerateMonthlyContributions implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Optional: define max attempts or timeout if needed
     */
    public $tries = 3;
    public $timeout = 120;

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $monthStart = Carbon::now()->startOfMonth();
        $monthEnd   = Carbon::now()->endOfMonth();

        $users = User::where('status', 'active')->get();

        // Fetch settings
        $settingAmount = Setting::find('monthly_contribution_amount');
        $settingDueDays = Setting::find('monthly_contribution_due_days');

        if (!$settingAmount || !$settingDueDays) {
            Log::error('⚠️ Paramètres manquants pour les contributions mensuelles.');
            return;
        }

        foreach ($users as $user) {
            $exists = DB::table('contributions')
                ->where('user_id', $user->id)
                ->where('type', 'monthly')
                ->whereBetween('due_date', [$monthStart->toDateString(), $monthEnd->toDateString()])
                ->exists();

            if (!$exists) {
                $dueDate = $monthStart->copy()->addDays((int) $settingDueDays->value);

                DB::table('contributions')->insert([
                    'user_id'    => $user->id,
                    'amount'     => (int) $settingAmount->value,
                    'type'       => 'monthly',
                    'status'     => 'pending',
                    'due_date'   => $dueDate->toDateString(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                Log::info("✅ Contribution mensuelle générée pour l'utilisateur {$user->id}");
            }
        }
    }
}
