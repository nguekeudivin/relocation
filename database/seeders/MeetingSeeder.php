<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Meeting;
use App\Models\Contribution;
use App\Models\MeetingContribution;
use App\Models\Setting;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class MeetingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('meeting_contribution')->delete();
        DB::table('contributions')->where('type', 'meeting_support')->delete();
        DB::table('meetings')->delete();

        $users = User::all();

        if ($users->isEmpty()) {
            $this->command->warn('⚠️ No users found — skipping MeetingSeeder.');
            return;
        }

        $now = Carbon::now();
        $setting = Setting::where('code', 'meeting_support_amount')->first();
        $amount = $setting ? (float) $setting->value : 5000;

        $meetings = [];
        $contributions = [];
        $meetingContributions = [];

        // === Generate meetings across 2 years ===
        foreach (range(0, 1) as $yearOffset) {
            $year = $now->copy()->subYears($yearOffset)->year;

            foreach ($users->random(min(10, $users->count())) as $host) {
                $date = Carbon::create($year, rand(1, 12), rand(1, 28));
                $meeting = Meeting::create([
                    'user_id'  => $host->id,
                    'date'     => $date,
                    'location' => $host->address ?? 'Lieu non spécifié',
                    'created_at' => $date,
                    'updated_at' => $date,
                ]);

                // Create meeting contributions for all users
                foreach ($users as $user) {
                    $status = collect(['pending', 'overdue', 'paid'])->random();

                    $contribution = Contribution::create([
                        'user_id'  => $user->id,
                        'amount'   => $amount,
                        'type'     => 'meeting_support',
                        'status'   => $status,
                        'due_date' => $date,
                        'created_at' => $date,
                        'updated_at' => $date,
                    ]);

                    MeetingContribution::create([
                        'user_id'         => $user->id,
                        'meeting_id'      => $meeting->id,
                        'contribution_id' => $contribution->id,
                        'created_at'      => $date,
                        'updated_at'      => $date,
                    ]);
                }
            }
        }

        // === Add a few upcoming meetings (future data) ===
        foreach ($users->random(min(5, $users->count())) as $host) {
            $futureDate = $now->copy()->addDays(rand(15, 90));

            $meeting = Meeting::create([
                'user_id'  => $host->id,
                'date'     => $futureDate,
                'location' => $host->address ?? 'Lieu non spécifié',
            ]);

            foreach ($users as $user) {
                $contribution = Contribution::create([
                    'user_id'  => $user->id,
                    'amount'   => $amount,
                    'type'     => 'meeting_support',
                    'status'   => 'pending',
                    'due_date' => $futureDate,
                ]);

                MeetingContribution::create([
                    'user_id'         => $user->id,
                    'meeting_id'      => $meeting->id,
                    'contribution_id' => $contribution->id,
                ]);
            }
        }

        $this->command->info('✅ MeetingSeeder completed: past + future meetings created successfully.');
    }
}
