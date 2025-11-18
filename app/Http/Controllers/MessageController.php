<?php

// app/Http/Controllers/MessageController.php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\MessageRead;
use App\Models\MessageReceive;
use App\Models\Attachment;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class MessageController extends Controller
{
    public function send(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'chat_id' => 'required|exists:chats,id',
            'user_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $message = Message::create([
            'chat_id' => $request->chat_id,
            'user_id' => $request->user_id,
            'content' => $request->content,
        ]);

        // The user that send the message already read it.
        MessageRead::create([
            'message_id' => $message->id,
            'user_id' => $message->user_id,
            'read_at' => now()
        ]);

        // The user that send the message already receive it.
        MessageReceive::create([
           'message_id' => $message->id,
           'user_id' => $message->user_id,
           'read_at' => now()
        ]);

        // Save attachements if there is some attachements
        if ($request->has('attachments')) {
            foreach ($request->attachments as $item) {
                $path = $item['file']->store('attachments', 'public');
                Attachment::create([
                    'url' => url(Storage::url($path)),
                    'type' => $item['type'],
                    'name' => $item['name'],
                    'size' => $item['size'],
                    'message_id' => $message->id
                ]);
            }
        }



        $message->load('chat.users', 'reads', 'receives', 'attachments'); // Load chat and its users if not already loaded
        $listeners = $message->chat->users->filter(function ($user) use ($message) {
            return $user->id != $message->user_id;
        });

        // Create notifications for listenrs.
        foreach ($listeners as $listener) {
            Notification::create([
                'user_id' => $listener->id, // recipient user
                'notificable_id' => $message->id,
                'notificable_type' => \App\Models\Message::class, // App\Models\Message
                'content' => 'You have a new message in a chat.',
                'link' => '/messages', // or a dynamic chat route
                'is_read' => false,
            ]);
        }

        return response()->json([
            'message' => $message,
            'listeners' => $listeners->pluck('id')->toArray()
        ], 201);
    }

    public function markAsRead(Request $request)
    {
        $read = MessageRead::firstOrCreate(
            ['message_id' => $request->message_id, 'user_id' => $request->user_id],
            ['read_at' => now()]
        );

        // Delete notification related to this message for this user
        Notification::where('user_id', $request->user_id)
            ->where('notificable_id', $request->message_id)
            ->where('notificable_type', \App\Models\Message::class)
            ->delete();

        $message = Message::find($request->message_id);
        $message->load('chat.users', 'reads', 'receives');

        $listeners = $message->chat->users->filter(function ($user) use ($request) {
            return $user->id != $request->user_id;
        });

        $read->load('message');

        return response()->json([
            'read' => $read,
            'listeners' => $listeners->pluck('id')->toArray()
        ]);
    }

    public function markAsReceive(Request $request)
    {
        $receive = MessageReceive::firstOrCreate(
            ['message_id' => $request->message_id, 'user_id' => $request->user_id],
        );

        $message = Message::find($request->message_id);
        $message->load('chat.users', 'reads', 'receives', 'attachments');

        $listeners = $message->chat->users->filter(function ($user) use ($request) {
            return $user->id != $request->user_id;
        });

        return response()->json([
            'receive' => $receive,
            'message' => $message,
            'listeners' => $listeners->pluck('id')->toArray()
        ]);
    }

    public function index($chatId)
    {
        $messages = Message::with(['user', 'images', 'reads','receives'])
            ->where('chat_id', $chatId)
            ->orderBy('created_at')
            ->get();

        return response()->json($messages);
    }

    public function destroy(Request $request, Message $message)
    {
        $message->delete();
        return response()->json($message);
    }
}