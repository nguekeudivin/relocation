<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\User\GetUsers;
use App\Http\Controllers\User\CreateUser;
use App\Http\Controllers\User\UpdateUser;
use App\Http\Controllers\User\GetUser;

use App\Http\Controllers\Setting\SaveManySettings;

use App\Http\Controllers\Slot\GetSlots;
use App\Http\Controllers\Slot\CreateSlot;
use App\Http\Controllers\Slot\UpdateSlot;
use App\Http\Controllers\Slot\DeleteSlot;

use App\Http\Controllers\Booking\GetBookings;
use App\Http\Controllers\Booking\CreateBooking;
use App\Http\Controllers\Booking\CancelBooking;
use App\Http\Controllers\Booking\UpdateBooking;

use App\Http\Controllers\Payment\GetPayments;

use App\Http\Controllers\Setting\GetSettings;
use App\Http\Controllers\Stats\UserStats;

// use App\Http\Controllers\Notification\GetNotifications;
// use App\Http\Controllers\Notification\MarkAsRead;
// use App\Http\Controllers\Notification\DeleteNotification;

// Routes
Route::middleware('auth:sanctum')->group(function () { 
 });

Route::prefix('/stats')->group(function(){
    Route::get('/user', UserStats::class);
});

Route::prefix('users')->group(function () {
    Route::get('/', GetUsers::class);
    Route::put('/{user}', UpdateUser::class);
    Route::get('/{user}', GetUser::class);
});

Route::prefix('settings')->group(function(){
    Route::post('/many', SaveManySettings::class);
    Route::get('/', GetSettings::class);
});

Route::prefix('/stols')->group(function(){
    Route::get('/', GetSlots::class);
    Route::post('/', CreateSlot::class);
    Route::put('/{slot}', UpdateSlot::class);
    Route::delete('/{slot}', DeleteSlot::class);
});

Route::prefix('/bookings')->group(function(){
    Route::get('/', GetBookings::class);
    Route::post('/', CreateBooking::class);
    Route::post('/{booking}/cancel', CancelBooking::class);
    Route::put('/{booking}',UpdateBooking::class);
});

Route::prefix('/payments')->group(function(){
    Route::get('/', GetPayments::class);
});

require __DIR__.'/chat.php';
