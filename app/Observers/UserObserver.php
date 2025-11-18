<?php

namespace App\Observers;

use App\Models\User;
use Illuminate\Support\Facades\Notification;
use App\Notifications\MemberCreatedNotification;

class UserObserver
{
    public function created(User $user)
    {
        $user->notify(new MemberCreatedNotification($user));
    }
}
