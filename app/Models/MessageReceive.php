<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MessageReceive extends Model
{
    public $timestamps = false;

    protected $fillable = ['user_id', 'message_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function message()
    {
        return $this->belongsTo(Message::class);
    }
}