<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\UserRole;

class UserPages extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();
        $userRole = UserRole::find($user->current_user_role_id);
 
        switch ($userRole->role->type) {
            case 'admin':
                return redirect()->to('admin/dashboard');
            default:
                return redirect()->to('user/profile');
        }
    }

    public function bookings(){
        return Inertia::render('user/my-bookings');
    }

    public function profile(){
        return Inertia::render('user/profile');
    }
   
}
