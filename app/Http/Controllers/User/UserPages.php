<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\UserRole;
use App\Models\Booking;
use Inertia\Inertia;
use Illuminate\Http\Request;


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
                return redirect()->to('user/bookings');
        }
    }

    public function bookings(){
        return Inertia::render('user/my-bookings/list');
    }

    public function editBooking(Request $request, Booking $booking){
        $booking->load(Booking::LOAD);
        return Inertia::render('user/my-bookings/edit', [
            'booking' => $booking
        ]);
    }

    public function profile(){
        return Inertia::render('user/my-profile');
    }

    public function messages(){
        return Inertia::render('user/my-messages');
    }

    public function payments(){
        return Inertia::render('user/my-payments');
    }
   
}
