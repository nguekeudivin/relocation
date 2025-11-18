<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\MessageReceive;
use App\Models\Message;
use App\Models\Chat;

class MessageReceiveController extends Controller
{
    public function show(Request $request, MessageReceive $messageReceive)
    {
        $messageReceive->load('message');
        return response()->json($messageReceive);
    }

    public function storeLatest(Request $request)
    {
        $userId = Auth::id();

        $chats = Chat::whereHas('users', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->get();

        // Get messages from these chats
        $messages = Message::whereIn('chat_id', $chats->pluck('id')->toArray())
            ->orderBy('created_at', 'desc')
            ->get();

        // Get IDs of messages the user has already received
        $receivedMessageIds = DB::table('message_receives')
            ->where('user_id', $userId)
            ->pluck('message_id')
            ->toArray();

        // Filter messages not yet received
        $unreceivedMessages = $messages->filter(function ($message) use ($receivedMessageIds) {
            return !in_array($message->id, $receivedMessageIds);
        });

        // Mark as received (bulk insert into message_user)
        $now = now();
        $insertData = $unreceivedMessages->map(function ($message) use ($userId, $now) {
            return [
                'user_id' => $userId,
                'message_id' => $message->id,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        })->values()->all();

        $listeners = [];
        $chatIds = [];

        if (!empty($insertData)) {
            DB::table('message_receives')->insert($insertData);

            foreach ($chats as $chat) {
                $listeners = array_merge($listeners, $chat->users->filter(function ($user) use ($userId) {
                    return $user->id != $userId;
                })->toArray());
                $chatIds[] = $chat->id;
            }
        }
        // Return only unreceived messages
        return response()->json([
            'listeners' => collect($listeners)->pluck('id')->toArray(),
            'chat_ids' => $chatIds
        ], 200);
    }
}