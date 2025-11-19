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
use App\Http\Controllers\Payment\GetPayments;

use App\Http\Controllers\Setting\GetSettings;
use App\Http\Controllers\Stats\UserStats;

// use App\Http\Controllers\Notification\GetNotifications;
// use App\Http\Controllers\Notification\MarkAsRead;
// use App\Http\Controllers\Notification\DeleteNotification;

use App\Http\Controllers\ChatController;
use App\Http\Controllers\MessageReadController;
use App\Http\Controllers\MessageReceiveController;
use App\Http\Controllers\NotificationController;

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
});

Route::prefix('/payments')->group(function(){
    Route::get('/', GetPayments::class);
});


Route::post('/chats', [ChatController::class, 'store']);
Route::get('/user/chats', [ChatController::class,'userChats']);

Route::post('/messages', [MessageController::class, 'send']);
Route::post('/messages/read', [MessageController::class, 'markAsRead']);
Route::post('/messages/receive', [MessageController::class, 'markAsReceive']);
Route::delete('/messages/{message}', [MessageController::class,'destroy']);

Route::get('/message-reads/{messageRead}', [MessageReadController::class, 'show']);
Route::post('/message-reads/{chat}/latest', [MessageReadController::class,'latestOf']);

Route::get('/message-receives/{messageReceive}', [MessageReceiveController::class,'show']);
Route::post('/message-receives/lastest', [MessageReceiveController::class,'storeLatest']);

Route::post('/get/chats', [ChatController::class, 'getChatsByIds']);
Route::get('/chats/{chatId}', [ChatController::class, 'show']);
Route::get('/chats/{chat}/users', [ChatController::class, 'getUsers']);
Route::get('/chats/{chat}/messages', [ChatController::class, 'getMessages']);

Route::get('/notifications', [NotificationController::class,'index']);
Route::get('/notifications/{notification}/read', [NotificationController::class,'read']);
Route::get('/notifications/{notification}', [NotificationController::class,'show']);

