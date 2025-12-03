<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Chat extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'creator_id',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'chat_user', 'chat_id', 'user_id');
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public static function findPrivateChatBetweenUsers(int $user1Id, int $user2Id)
    {
        // Ensure the provided user IDs are different to avoid self-chat confusion
        if ($user1Id === $user2Id) {
            return null;
        }
        $chat = Chat::whereHas('users', function ($query) use ($user1Id) {
            $query->where('user_id', $user1Id);
        })
        ->whereHas('users', function ($query) use ($user2Id) {
            $query->where('user_id', $user2Id);
        })
        ->has('users', '=', 2)
        ->first();

        return $chat;
    }
}
