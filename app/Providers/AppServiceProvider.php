<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\User;
use App\Models\Contribution;
use App\Models\Help;
use App\Models\Meeting;
use App\Observers\UserObserver;
use App\Observers\ContributionObserver;
use App\Observers\HelpObserver;
use App\Observers\MeetingObserver;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        require_once app_path('/Helpers/translation.php');
    }
}
