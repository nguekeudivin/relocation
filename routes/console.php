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

Schedule::job(new GenerateMonthlyContributions)->name('generate:contribution')->monthlyOn(1, '00:05')->withoutOverlapping();
Schedule::job(new CheckContributionOverdues)->name('check:payment')->everyMinute();

Artisan::command('demo:monthly', function(){
     GenerateMonthlyContributions::dispatch();
     // Always make the first contribution overdued.
     $contributions = Contribution::all();
     for($i = 0; $i <2;$i++){
         $contributions[$i]->update(['due_date' => '2025-10-10']);
     }
});

Artisan::command('demo:overdue',function(){
    CheckContributionOverdues::dispatch();
});