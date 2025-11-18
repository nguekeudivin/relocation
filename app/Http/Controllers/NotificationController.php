<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        $notifications = Notification::where('user_id', $userId)
            ->latest()
            ->get();

        return response()->json($notifications);
    }

    public function read(Request $request, Notification $notification)
    {
        $link = $notification->link;
        $notification->delete();
        return redirect()->to($notification->link);
    }

    public function show(Request $request, Notification $notification)
    {
        return response()->json($notification);
    }


    public function markAsRead($id)
    {
        $notification = Notification::where('user_id', Auth::id())->findOrFail($id);
        $notification->is_read = true;
        $notification->save();

        return response()->json(['message' => 'Notification marked as read']);
    }

    public function destroy($id)
    {
        $notification = Notification::where('user_id', Auth::id())->findOrFail($id);
        $notification->delete();

        return response()->json(['message' => 'Notification deleted']);
    }
}