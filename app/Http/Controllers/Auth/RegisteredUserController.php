<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Chat;
use App\Models\User;
use App\Models\Role;
use App\Services\Booking\SaveBooking;
use Illuminate\Support\Facades\DB; 
use App\Mail\User\AccountCreatedMail;
use App\Mail\User\AccountCreatedAdminMail;
use Illuminate\Support\Facades\Mail;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|string|max:255|unique:users,email',
            'phone_number' => 'required|max:255|unique:users,phone_number',
            'last_name' => 'required|string|max:255',
            'password' => ['required'],
        ]);

        DB::beginTransaction(); // <-- FIXED

        try {
            $user = User::create([
                'first_name'    => $request->first_name,
                'last_name'     => $request->last_name,
                'phone_number'  => $request->phone_number,
                'email'         => $request->email,
                'password'      => Hash::make($request->password),
            ]);
            
            $clientRole = Role::where('code', 'client')->first();
            $user->attachRole($clientRole->id);

            if ($request->has('booking')) {
                $data = $request->booking;
                $data['user_id'] = $user->id;
                $booking = SaveBooking::run($data);
            }

            // Create a chat discussion.
            if(isset($data['user_id'])){
                $admin = User::whereHas('roles', function ($query) {
                    $query->where('code', 'admin');
                })->first();
                $chat = Chat::create([
                    'creator_id' => $data['user_id'],
                ]);
                $chat->users()->attach([$data['user_id'], $admin->id]);
            }

            DB::commit();

            Mail::to($booking->email)->queue(
             new AccountCreatedMail($user)
            );
            Mail::to(User::getAdmin()->email)->queue(
                new AccountCreatedAdminMail($user)
            );

            event(new Registered($user));
            Auth::login($user);

            return redirect()->route('dashboard'); // cleaner

        } catch (\Throwable $e) {

            DB::rollBack();

            return redirect()
                ->back()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }
}
