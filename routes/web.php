<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\User\UserPages;
use App\Http\Controllers\User\ChangeUserLanguage;

use App\Http\Controllers\User\AdminPages;
use App\Http\Controllers\User\ChangeUserProfile;
use App\Http\Controllers\QueryController;

Route::get('/', function () {
   return Inertia::render('home');
});

Route::post('/validate/phone-number', [ValidationController::class,'phoneNumber']);

Route::middleware(['auth'])->group(function () {

    Route::post('query',[QueryController::class,'index'])->name('query');
   
    Route::get('/dashboard', [UserPages::class, 'dashboard'])->name('dashboard');
    Route::get('/profile/change/{userRole}', ChangeUserProfile::class)->name('changeUserProfile');

    Route::prefix('admin')->group(function(){
        Route::get('/dashboard', [AdminPages::class,'dashboard'])->name('admin.dashboard');
        Route::get('/bookings', [AdminPages::class,'bookings'])->name('admin.dashboard');
        Route::get('/payments', [AdminPages::class,'payments'])->name('admin.dashboard');
        Route::get('/users', [AdminPages::class, 'users'])->name('admin.members');
        Route::get('/calendar', [AdminPages::class, 'calendar'])->name('admin.meetings');
        Route::get('/settings', [AdminPages::class, 'settings'])->name('admin.settings');
    });

    Route::prefix('user')->group(function(){
        Route::get('/bookings', [UserPages::class,'bookings'])->name('user.dashboard');
        Route::get('/bookings/{booking}/edit',[UserPages::class,'editBooking']);
        Route::get('/profile', [UserPages::class, 'profile'])->name('user.profile');
        Route::get('/payments', [UserPages::class, 'payments'])->name('user.payments');
        Route::get('/messages', [UserPages::class, 'messages'])->name('user.payments');
        Route::get('/notifications', [UserPages::class, 'notifications'])->name('user.notifications');
        Route::get('/lang', ChangeUserLanguage::class);
    });
});

require __DIR__.'/auth.php';
