<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\UserRole;
use App\Models\Booking;
use App\Models\User;
use App\Models\Chat;

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
                // Check if there is a chat between the admin and the current user. If not create one.
                 $admin = User::whereHas('roles', function ($query) {
                        $query->where('code', 'admin');
                    })->first();
                    $chat = Chat::findPrivateChatBetweenUsers($user->id, $admin->id);

                    dd($chat);
                    if(!$chat){
                        $chat = Chat::create([
                            'creator_id' => $user->id
                        ]);
                        $chat->users()->attach([$user->id, $admin->id]);
                    }
                return redirect()->to('user/bookings');
        }
    }

    public function bookings(Request $request){
        return Inertia::render('user/my-bookings/list', [
            'success' => $request->session()->get('success'),
        ]);
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

    public function messages(Request $request){
        $user = $request->user();

        // Si l'URL contient déjà ?chatId=...
        if ($request->has('chatId')) {
            return Inertia::render('user/my-messages');
        }

        // Chercher l'admin
        $admin = User::whereHas('roles', function ($query) {
            $query->where('code', 'admin');
        })->first();

        // Trouver ou créer le chat privé entre l'utilisateur et l'admin
        $chat = Chat::findPrivateChatBetweenUsers($user->id, $admin->id);

        // Redirection vers /user/messages?chatId=xxx
        return redirect("/user/messages?chatId={$chat->id}");
    }

    public function payments(){
        return Inertia::render('user/my-payments');
    }
   
}
