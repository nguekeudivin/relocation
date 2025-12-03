<?php

namespace App\Http\Controllers\Notification;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class GetNotifications extends Controller
{
    public function __invoke(Request $request)
    {
        $userId = $request->query('user_id');

        if (!$userId || !($user = User::find($userId))) {
            return response()->json(['message' => 'Utilisateur introuvable.'], 404);
        }

        $notifications = $user->notifications()->latest()->get();

        return response()->json($notifications);
    }
}
