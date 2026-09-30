<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Jobs\GenerateMonthlyContributions;
use App\Jobs\CheckContributionOverdues;


use App\Models\Meeting;
use Illuminate\Support\Facades\Notification;
use App\Models\User;
use App\Notifications\MeetingCreatedNotification;
use App\Models\Contribution;


Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Equivalent de `migrate:fresh --seed` — contourne le blocage des commandes
// destructives (migrate:fresh, db:wipe) imposé par Laravel Cloud.
// ⚠️ DESTRUCTIF : supprime toutes les tables.
Artisan::command('app:rebuild {--seed : Seed the database after rebuilding}', function () {
    $this->warn('Dropping all tables...');

    \Illuminate\Support\Facades\Schema::dropAllTables();

    $this->call('migrate', ['--force' => true]);

    if ($this->option('seed')) {
        $this->call('db:seed', ['--force' => true]);
    }

    $this->info('Database rebuilt successfully.');
})->purpose('Drop all tables, run migrations and optionally seed (migrate:fresh --seed alternative)');

Artisan::command('demo:monthly', function(){
     
});
