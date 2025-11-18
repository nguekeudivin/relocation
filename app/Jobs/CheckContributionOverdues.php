<?php

namespace App\Jobs;

use App\Models\Contribution;
use App\Notifications\ContributionOverdueNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Notification;
use Carbon\Carbon;

class CheckContributionOverdues implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Execute the job.
     */
    public function handle()
    {
        $today = Carbon::today();

        // Get all pending contributions whose due_date has passed
        $overdueContributions = Contribution::whereNull('payment_date')
            ->whereDate('due_date', '<', $today)
            ->with('user')
            ->get();

        foreach ($overdueContributions as $contribution) {
            // Update status to overdue
            $contribution->status = 'overdue';
            $contribution->save();

            // Send notification to the member
            if ($contribution->user) {
                $contribution->user->notify(new ContributionOverdueNotification($contribution));
            }
        }
    }
}
