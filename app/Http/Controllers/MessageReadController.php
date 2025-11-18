<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MessageRead;
use App\Models\Chat;
use App\Models\Message;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class MessageReadController extends Controller
{
    public function show(Request $request, MessageRead $messageRead)
    {
        $messageRead->load('message');
        return response()->json($messageRead);
    }

    public function latestOf(Request $request, Chat $chat)
    {
        $userId = Auth::id();
        $chatId = $chat->id;

        // Step 1: Get messages in the chat not sent by the current user
        $messages = Message::where('chat_id', $chatId)
            ->where('user_id', '!=', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        $messageIds = $messages->pluck('id');

        // Step 2: Get IDs of already read messages
        $alreadyReadIds = MessageRead::where('user_id', $userId)
            ->whereIn('message_id', $messageIds)
            ->pluck('message_id')
            ->toArray();

        // Step 3: Identify unread messages
        $unreadIds = $messageIds->diff($alreadyReadIds);

        // Delete all the notifications for the unreads messages.
        Notification::whereIn('notificable_id', $unreadIds)->where('notificable_type', \App\Models\Message::class)->delete();

        // Step 4: Mark unread messages as read
        $now = Carbon::now();
        $readsToInsert = $unreadIds->map(fn ($id) => [
            'user_id' => $userId,
            'message_id' => $id,
            'read_at' => $now,
        ]);

        $listeners = [];
        if ($readsToInsert->isNotEmpty()) {
            MessageRead::insert($readsToInsert->all());
            // Step 5: Get the other users in the chat (listeners)
            $listeners = DB::table('chat_user')
                ->where('chat_id', $chatId)
                ->where('user_id', '!=', $userId)
                ->pluck('user_id');
        }

        return response()->json([
            'listeners' => $listeners,
            'reads_ids' => $unreadIds,
            'notifications' => Notification::where('user_id', $userId)->get(),
            'last_message' => Message::where('chat_id', $chatId)
                            ->orderBy('created_at', 'desc')
                            ->first(),
        ]);
    }
}