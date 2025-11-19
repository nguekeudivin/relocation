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
use App\Models\Setting;
use App\Models\Booking;
use App\Models\Address;
use App\Models\Role;
use Illuminate\Support\Facades\DB; // <-- REQUIRED

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
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

            // if ($request->has('booking')) {
            //     $settings = Setting::all()->pluck('value', 'code');
            //     $data = $request->booking;

            //     // ---- Compute Costs ----
            //     $workersCost  = $settings['price_per_worker'] * $data['workers'];
            //     $durationCost = $settings['price_per_hour']    * $data['duration'];
            //     $carsCost     = $settings['price_per_car']     * $data['cars'];

            //     // ---- Create Addresses ----
            //     $origin = Address::create([
            //         'city'   => $data['from_city'],
            //         'street' => $data['from_street'],
            //     ]);

            //     $destination = Address::create([
            //         'city'   => $data['to_city'],
            //         'street' => $data['to_street'],
            //     ]);

            //     // ---- Create Booking ----
            //     Booking::create([
            //         'user_id'        => $user->id,
            //         'origin_id'      => $origin->id,
            //         'destination_id' => $destination->id, // <-- FIXED (was 'destination')
            //         'date'           => $data['date'],
            //         'workers'        => $data['workers'],
            //         'duration'       => $data['duration'],
            //         'amount'         => $workersCost + $durationCost + $carsCost,
            //         'status'         => 'waiting_payment',
            //     ]);
            // }

            DB::commit();

            event(new Registered($user));
            Auth::login($user);

            return redirect()->route('dashboard'); // cleaner

        } catch (\Throwable $e) {

            DB::rollBack();

            // Optional: Log error
            // \Log::error($e);

            return redirect()
                ->back()
                ->withErrors(['error' => 'Registration failed. Please try again.']);
        }
    }
}
