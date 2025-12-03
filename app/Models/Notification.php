<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'notificable_type',
        'notificable_id',
        'content',
        'link',
        'is_read',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function notificable(): MorphTo
    {
        return $this->morphTo();
    }
}
