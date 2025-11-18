<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\UserRole;
use Inertia\Inertia;

class AdminPages extends Controller
{
    public function dashboard()
    {
        return Inertia::render('admin/dashboard/page');
    }

    public function users(){
        return Inertia::render('admin/users/page');
    }

    public function bookings(){
        return Inertia::render('admin/bookings/page');
    }

    public function payments(){
        return Inertia::render('admin/payments/page');
    }

    public function calendar(){
        return Inertia::render('admin/calendar/page');
    }

    public function settings(){
        return Inertia::render('admin/settings/page');
    }

    public function notifications(){
        return Inertia::render('admin/notifications/page');
    }
}
