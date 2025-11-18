<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\Payment\CreateCredit;
use App\Http\Controllers\Payment\CreateDebit;
use App\Http\Controllers\Payment\GetPayment;
use App\Http\Controllers\Payment\SimulateCredit;
use App\Http\Controllers\Payment\SimulateDebit;

use App\Http\Controllers\User\GetUsers;
use App\Http\Controllers\User\CreateUser;
use App\Http\Controllers\User\UpdateUser;
use App\Http\Controllers\User\DeleteUser;
use App\Http\Controllers\User\UserPages;
use App\Http\Controllers\User\MemberPages;
use App\Http\Controllers\User\AdminPages;
use App\Http\Controllers\Contribution\ContributionPages;
use App\Http\Controllers\User\ChangeUserProfile;
use App\Http\Controllers\QueryController;

Route::get('/', function () {
   return redirect('login');
});

Route::post('/validate/phone-number', [ValidationController::class,'phoneNumber']);

Route::middleware(['auth'])->group(function () {

    Route::post('query',[QueryController::class,'index'])->name('query');
   
    Route::get('/dashboard', [UserPages::class, 'dashboard'])->name('dashboard');
    Route::get('/profile/change/{userRole}', ChangeUserProfile::class)->name('changeUserProfile');

    Route::prefix('admin')->group(function(){
        Route::get('/dashboard', [AdminPages::class,'dashboard'])->name('admin.dashboard');
        Route::get('/users', [UserPages::class, 'list'])->name('users.list');
        Route::get('/users/{user}',[UserPages::class, 'details'])->name('users.details');

        Route::get('/contributions/listing', [ContributionPages::class, 'listing'])->name('admin.contributions.listing');
        Route::get('/contributions/analytics', [ContributionPages::class, 'analytics'])->name('admin.contributions.analytics');

        Route::get('/helps', [AdminPages::class, 'helps'])->name('admin.helps');

        Route::get('/debts', [AdminPages::class, 'debts'])->name('admin.debts');
        Route::get('/borrowings', [AdminPages::class, 'borrowings'])->name('admin.borrowings');
        Route::get('/helps', [AdminPages::class, 'helps'])->name('admin.helps');
        Route::get('/expenses', [AdminPages::class, 'expenses'])->name('admin.expenses');
        Route::get('/members', [AdminPages::class, 'members'])->name('admin.members');
        Route::get('/meetings', [AdminPages::class, 'meetings'])->name('admin.meetings');
        Route::get('/settings', [AdminPages::class, 'settings'])->name('admin.settings');
        Route::get('/notifications', [AdminPages::class, 'notifications'])->name('admin.notifications');
    });

    Route::prefix('member')->group(function(){
        Route::get('/dashboard', [MemberPages::class,'dashboard'])->name('member.dashboard');
        Route::get('/contributions', [MemberPages::class, 'contributions'])->name('member.contributions');
        Route::get('/helps', [MemberPages::class, 'helps'])->name('member.helps');
        Route::get('/meetings', [MemberPages::class, 'meetings'])->name('member.meetings');
        Route::get('/informations', [MemberPages::class, 'informations'])->name('member.state');
    });
});

require __DIR__.'/auth.php';
