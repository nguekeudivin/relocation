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

    public function contributions(){
        return Inertia::render('admin/contributions/page');
    }

    public function debts(){
        return Inertia::render('admin/debts/page');
    }

    public function borrowings(){
        return Inertia::render('admin/borrowings/page');
    }

    public function helps(){
        return Inertia::render('admin/helps/page');
    }

    public function expenses(){
        return Inertia::render('admin/expenses/page');
    }

    public function members(){
        return Inertia::render('admin/members/page');
    }

    public function meetings(){
        return Inertia::render('admin/meetings/page');
    }

    public function settings(){
        return Inertia::render('admin/settings/page');
    }

    public function notifications(){
        return Inertia::render('admin/notifications/page');
    }
}
