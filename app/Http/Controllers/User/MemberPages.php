<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\UserRole;
use Inertia\Inertia;

class MemberPages extends Controller
{
    public function dashboard()
    {
        return Inertia::render('member/dashboard/page');
    }

    public function contributions(){
        return Inertia::render('member/contributions/page');
    }

    public function helps(){
        return Inertia::render('member/helps/page');
    }

    public function informations(){
        return Inertia::render('member/informations/page');
    }
}
