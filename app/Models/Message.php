<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Message extends Model
{
    protected $fillable = ['chat_id', 'user_id', 'content'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function chat()
    {
        return $this->belongsTo(Chat::class);
    }

    public function images(): MorphMany
    {
        return $this->morphMany(Image::class, 'imageable');
    }

    public function reads()
    {
        return $this->hasMany(MessageRead::class);
    }

    public function receives()
    {
        return $this->hasMany(MessageReceive::class);
    }

    public function attachments()
    {
        return $this->hasMany(Attachment::class);
    }
}