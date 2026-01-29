<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\QueryController;


use App\Http\Controllers\User\UserPages;
use App\Http\Controllers\User\ChangeUserLanguage;
use App\Http\Controllers\User\AdminPages;
use App\Http\Controllers\User\ChangeUserProfile;
use App\Http\Controllers\User\GetUsers;
use App\Http\Controllers\User\UpdateUser;
use App\Http\Controllers\User\GetUser;

use App\Http\Controllers\Booking\GenerateInvoice;
use App\Http\Controllers\Booking\GenerateInvoiceById;
use App\Http\Controllers\Booking\GetBookings;
use App\Http\Controllers\Booking\CreateBooking;
use App\Http\Controllers\Booking\CompleteBooking;
use App\Http\Controllers\Booking\ConfirmBooking;
use App\Http\Controllers\Booking\UpdateBooking;
use App\Http\Controllers\Booking\NotifyPayment;

use App\Http\Controllers\Setting\GetSettings;
use App\Http\Controllers\Setting\SaveManySettings;
use App\Http\Controllers\Stats\UserStats;
use App\Http\Controllers\Stats\BookingStats;


Route::get('/', function () {
   return Inertia::render('home');
});

Route::get('/terms', function(){
    return Inertia::render('home');
});

Route::get('/privacy', function(){
    return Inertia::render('home');
});

Route::get('/settings', GetSettings::class);
Route::post('/bookings', CreateBooking::class);
Route::get('/invoice', GenerateInvoice::class)->name('invoice');

Route::middleware(['auth'])->group(function () {

    Route::post('query',[QueryController::class,'index'])->name('query');
   
    Route::get('/dashboard', [UserPages::class, 'dashboard'])->name('dashboard');
    Route::get('/profile/change/{userRole}', ChangeUserProfile::class)->name('changeUserProfile');

    Route::prefix('admin')->group(function(){
        Route::get('/dashboard', [AdminPages::class,'dashboard'])->name('admin.dashboard');
        Route::get('/bookings', [AdminPages::class,'bookings'])->name('admin.bookings');
        Route::get('/payments', [AdminPages::class,'payments'])->name('admin.payments');
        Route::get('/users', [AdminPages::class, 'users'])->name('admin.users');
        Route::get('/users/{user}', [AdminPages::class,'userDetails'])->name('admin.userDetails');
        Route::get('/calendar', [AdminPages::class, 'calendar'])->name('admin.calendar');
        Route::get('/messages',[AdminPages::class,'messages'])->name('admin.messages');
        Route::get('/settings', [AdminPages::class, 'settings'])->name('admin.settings');
    });

    Route::prefix('user')->group(function(){
        Route::get('/bookings', [UserPages::class,'bookings'])->name('user.bookings');
        Route::get('/bookings/{booking}/edit',[UserPages::class,'editBooking'])->name('user.editBooking');
        Route::get('/profile', [UserPages::class, 'profile'])->name('user.profile');
        Route::get('/payments', [UserPages::class, 'payments'])->name('user.payments');
        Route::get('/messages', [UserPages::class, 'messages'])->name('user.messages');
        Route::get('/notifications', [UserPages::class, 'notifications'])->name('user.notifications');
        Route::get('/lang', ChangeUserLanguage::class);
    });

    Route::get('/messages', [UserPages::class,'messages'])->name('user.messages');

    Route::prefix('/stats')->group(function(){
        Route::get('/user', UserStats::class);
        Route::get('/booking', BookingStats::class);
    });

    Route::prefix('users')->group(function () {
        Route::get('/', GetUsers::class);
        Route::put('/{user}', UpdateUser::class);
        Route::get('/{user}', GetUser::class);
    });

    Route::post('/settings/many', SaveManySettings::class);

    Route::prefix('/bookings')->group(function(){
        Route::get('/', GetBookings::class);
        Route::get('/{booking}/invoice', GenerateInvoiceById::class);
        Route::post('/{booking}/notify', NotifyPayment::class);
        Route::post('/{booking}/confirm', ConfirmBooking::class);
        Route::post('/{booking}/complete', CompleteBooking::class);
        Route::put('/{booking}',UpdateBooking::class);
    });
});

Route::get('/preview-mail', function () {
    $booking = \App\Models\Booking::first(); 
    // return new \App\Mail\BookingCreatedMail($booking, $user, $greetingName);
    return new \App\Mail\NotifyPaymentMail($booking );
});

require __DIR__.'/auth.php';
require __DIR__.'/chat-web.php';
