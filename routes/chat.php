<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\MessageController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\MessageReadController;
use App\Http\Controllers\MessageReceiveController;
use App\Http\Controllers\NotificationController;

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