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

Artisan::command('demo:monthly', function(){
     
});
