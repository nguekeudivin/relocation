<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Attachment extends Model
{
    // Define the fillable attributes
    protected $fillable = [
        'type',
        'url',
        'name',
        'size',
        'message_id',
    ];

    /**
     * Get the message that owns the attachment.
     */
    public function message(): BelongsTo
    {
        return $this->belongsTo(Message::class);
    }

    /**
     * Delete the file from storage and then delete the model.
     */
    public function deleteWithFile(): bool|null
    {
        if ($this->url && Storage::disk('public')->exists($this->url)) {
            Storage::disk('public')->delete($this->url);
        }

        return $this->delete();
    }

    /**
     * Optionally, accessors for size in KB/MB etc.
     */
    public function getSizeInKbAttribute(): float
    {
        return round($this->size / 1024, 2);
    }

    public function getSizeInMbAttribute(): float
    {
        return round($this->size / (1024 * 1024), 2);
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