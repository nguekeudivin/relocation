<?php

namespace App\Http\Controllers\Notification;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class MarkAsRead extends Controller
{
    public function __invoke(Request $request)
    {
        $userId = $request->user_id;

        if (!$userId || !($user = User::find($userId))) {
            return response()->json(['message' => 'Utilisateur introuvable.'], 404);
        }

        $notificationId = $request->notification_id;

        if ($notificationId) {
            // Mark a single notification as read
            $notification = $user->notifications()->where('id', $notificationId)->first();

            if (!$notification) {
                return response()->json(['message' => 'Notification introuvable.'], 404);
            }

            $notification->markAsRead();
        } else {
            // Mark all notifications as read
            $user->unreadNotifications->markAsRead();
        }

        return response()->json(User::find(1)->notifications()->latest()->get());
    }
}
