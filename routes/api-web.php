<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\User\GetUsers;
use App\Http\Controllers\User\UpdateUser;
use App\Http\Controllers\User\GetUser;

use App\Http\Controllers\Setting\SaveManySettings;

use App\Http\Controllers\Slot\GetSlots;
use App\Http\Controllers\Slot\UpdateSlot;
use App\Http\Controllers\Slot\DeleteSlot;
use App\Http\Controllers\Slot\CreateManySlots;

use App\Http\Controllers\Booking\GetBookings;
use App\Http\Controllers\Booking\CreateBooking;
use App\Http\Controllers\Booking\CancelBooking;
use App\Http\Controllers\Booking\CompleteBooking;
use App\Http\Controllers\Booking\ConfirmBooking;
use App\Http\Controllers\Booking\RejectBooking;
use App\Http\Controllers\Booking\UpdateBooking;

use App\Http\Controllers\Payment\GetPayments;

use App\Http\Controllers\Setting\GetSettings;
use App\Http\Controllers\Stats\UserStats;
use App\Http\Controllers\Stats\BookingStats;


Route::prefix('/stats')->group(function(){
    Route::get('/user', UserStats::class);
    Route::get('/booking', BookingStats::class);
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

Route::prefix('/slots')->group(function(){
    Route::get('/', GetSlots::class);
    Route::put('/{slot}', UpdateSlot::class);
    Route::delete('/{slot}', DeleteSlot::class);
    Route::post('/many', CreateManySlots::class);
});

Route::prefix('/bookings')->group(function(){
    Route::get('/', GetBookings::class);
    Route::post('/', CreateBooking::class);
    Route::post('/{booking}/cancel', CancelBooking::class);
    Route::post('/{booking}/reject', RejectBooking::class);
    Route::post('/{booking}/confirm', ConfirmBooking::class);
    Route::post('/{booking}/complete', CompleteBooking::class);

    Route::put('/{booking}',UpdateBooking::class);
});

Route::prefix('/payments')->group(function(){
    Route::get('/', GetPayments::class);
});

//require __DIR__.'/chat.php';
