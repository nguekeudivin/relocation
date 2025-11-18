<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $eighteenYearsAgo = now()->subYears(18)->format('Y-m-d');

        $request->validate([
            'lastname' => 'required|string|max:255',
            'firstname' => 'required|string|max:255',
            // 'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required'],
            'birth_date' => ['required', 'date']
        ]);

        $user = User::create([
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'phone_number' => $request->phone_number,
            'password' => Hash::make($request->password),
            'birth_date' => $request->birth_date,
            'work_types' => json_encode([]),
            'experiences' => json_encode([]),
            'goals' => json_encode([]),
            'last_online' => now(),
            'is_online' => true
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->to('setup/location');
    }
}
