<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ChatController extends Controller
{

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'sender_id' => 'required|exists:users,id',
            'receiver_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $senderId = $request->sender_id;
        $receiverId = $request->receiver_id;

        if ($senderId === $receiverId) {
            return response()->json(['message' => 'Cannot create a private chat with yourself.'], 400);
        }

        $existingChat = Chat::findPrivateChatBetweenUsers($senderId, $receiverId);
        if ($existingChat) {
            $existingChat->load('users');
            return response()->json($existingChat, 201);
        }

        $newChat = Chat::create([
            'creator_id' => $senderId,
        ]);

        $newChat->users()->attach([$senderId, $receiverId]);
        $newChat->load('users');


        return response()->json($newChat, 201);
    }

    public function userChats()
    {
        $userId = Auth::id();

        if (!$userId) {
            return response()->json(['message' => 'Authentication required.'], 401);
        }

        $chats = Chat::whereHas('users', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })
        ->with([
            'users.image',
            'messages' => function ($query) {
                $query->orderBy('created_at', 'asc')
                      ->with('reads', 'receives', 'user', 'attachments');
            }
        ])
        ->get();

        return response()->json($chats, 200);
    }

    public function getChatsByIds(Request $request)
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Authentication required.'], 401);
        }

        $chats = Chat::WhereIn('id', $request->chat_ids)->whereHas('users', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })
        ->with([
            'users.image',
            'messages' => function ($query) {
                $query->orderBy('created_at', 'asc')
                      ->with('reads', 'receives', 'user', 'attachments');
            }
        ])
        ->get();

        return response()->json($chats, 200);
    }

    public function show(Request $request)
    {

        $chat = Chat::where('id', $request->chatId)->with([
            'users.image',
            'messages' => function ($query) {
                $query->orderBy('created_at', 'asc')
                      ->with('reads', 'receives', 'user', 'attachments');
            }
        ])
        ->first();

        return response()->json($chat);
    }
}