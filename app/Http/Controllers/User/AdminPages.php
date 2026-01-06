<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminPages extends Controller
{
    public function dashboard()
    {
        return Inertia::render('admin/dashboard');
    }

    public function users(){
        return Inertia::render('admin/users');
    }

    public function bookings(){
        return Inertia::render('admin/bookings');
    }

    public function payments(){
        return Inertia::render('admin/payments');
    }

    public function calendar(){
        return Inertia::render('admin/calendar');
    }

    public function settings(){
        return Inertia::render('admin/settings');
    }

    public function messages(){
        return Inertia::render('admin/messages');
    }
}
