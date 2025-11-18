<?php

use Illuminate\Support\Facades\Route;

// use App\Http\Controllers\Payment\CreateCredit;
// use App\Http\Controllers\Payment\CreateDebit;
// use App\Http\Controllers\Payment\SimulateCredit;
// use App\Http\Controllers\Payment\SimulateDebit;
// use App\Http\Controllers\Payment\GetPayment;
// use App\Http\Controllers\Payment\GetPayments;

// use App\Http\Controllers\User\GetUsers;
// use App\Http\Controllers\User\CreateUser;
// use App\Http\Controllers\User\UpdateUser;
// use App\Http\Controllers\User\GetUser;

// use App\Http\Controllers\Setting\SaveManySettings;

// use App\Http\Controllers\Meeting\GetMeetings;
// use App\Http\Controllers\Meeting\CreateMeeting;
// use App\Http\Controllers\Meeting\UpdateMeeting;
// use App\Http\Controllers\Meeting\DeleteMeeting;

// use App\Http\Controllers\Finance\GetFinanceAccounts;
// use App\Http\Controllers\Finance\CreateFinanceAccount;
// use App\Http\Controllers\Finance\UpdateFinanceAccount;
// use App\Http\Controllers\Finance\ShowFinanceAccount;
// use App\Http\Controllers\Finance\DeleteFinanceAccount;

// use App\Http\Controllers\Finance\GetTransactions;
// use App\Http\Controllers\Finance\CreateTransaction;
// use App\Http\Controllers\Finance\UpdateTransaction;
// use App\Http\Controllers\Finance\CancelTransaction;

// use App\Http\Controllers\Stats\UserStats;
// use App\Http\Controllers\Stats\ContributionStats;
// use App\Http\Controllers\Stats\TransactionStats;
// use App\Http\Controllers\Stats\HelpStats;

// use App\Http\Controllers\Notification\GetNotifications;
// use App\Http\Controllers\Notification\MarkAsRead;
// use App\Http\Controllers\Notification\DeleteNotification;

// Routes
Route::middleware('auth:sanctum')->group(function () { 
 });

// Route::prefix('/stats')->group(function(){
//     Route::get('/user', UserStats::class);
//     Route::get('/transaction', TransactionStats::class);
//     Route::get('/help', HelpStats::class);
//     Route::get('/contribution', ContributionStats::class);
// });

// Route::prefix('financial-accounts')->group(function () {
//     Route::get('/', GetFinanceAccounts::class);
//     Route::post('/', CreateFinanceAccount::class);
//     Route::put('/{FinanceAccount}', UpdateFinanceAccount::class);
//     Route::delete('/{FinanceAccount}', DeleteFinanceAccount::class);
// });

// Route::prefix('/transactions')->group(function(){
//     Route::get('/', GetTransactions::class);
//     Route::post('/', CreateTransaction::class);
//     Route::put('/{transaction}',UpdateTransaction::class);
// });

// Route::prefix('payments')->group(function () {
//     Route::get('/', GetPayments::class);
//     Route::post('/credit', CreateCredit::class);
//     Route::post('/debit', CreateDebit::class);
//     Route::post('/simulate/credit', SimulateCredit::class);
//     Route::post('/simulate/debit', SimulateDebit::class);
//     Route::get('/{payment}', GetPayment::class);
// });

// Route::prefix('users')->group(function () {
//     Route::get('/', GetUsers::class);
//     Route::post('/', CreateUser::class);
//     Route::put('/{user}', UpdateUser::class);
//     Route::get('/{user}', GetUser::class);
// });


// Route::prefix('settings')->group(function(){
//     Route::post('/many', SaveManySettings::class);
// });



// Route::prefix('/disponibilities')->group(function(){
//     Route::get('/', GetMeetings::class);
//     Route::post('/', CreateMeeting::class);
//     Route::put('/{disponibility}', UpdateMeeting::class);
//     Route::delete('/{disponibility}', DeleteMeeting::class);
// });


// Route::prefix('notifications')->group(function () {
//     Route::get('/', GetNotifications::class)->name('notifications.index');
//     Route::post('/mark-as-read', MarkAsRead::class)->name('notifications.markAsRead');
//     Route::post('/remove', DeleteNotification::class)->name("notifications.deleteNotification");
// });
