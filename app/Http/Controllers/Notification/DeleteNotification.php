<?php

namespace App\Http\Controllers\Notification;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class DeleteNotification extends Controller
{
    public function __invoke(Request $request)
    {
        $userId = $request->input('user_id');
        $notificationId = $request->notification_id;

        if (!$userId || !($user = User::find($userId))) {
            return response()->json(['message' => 'Utilisateur introuvable.'], 404);
        }

        if($notificationId) {
            if (!$notificationId) {
                return response()->json(['message' => 'L’ID de la notification est requis.'], 400);
            }

            $notification = $user->notifications()->find($notificationId);

            if (!$notification) {
                return response()->json(['message' => 'Notification introuvable.'], 404);
            }

            // Store the notification temporarily for response before deleting
            $deletedNotification = $notification->toArray();
            $notification->delete();
        }else{
            $user->notifications()->delete();
        }

        return response()->json($user->notifications()->latest()->get());
    }
}
