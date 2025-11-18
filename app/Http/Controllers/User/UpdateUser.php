<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Asset;

class UpdateUser extends Controller
{
    public function __invoke(Request $request, User $user)
    {
        $request->validate([
            'first_name'       => 'sometimes|string|max:255',
            'last_name'        => 'sometimes|string|max:255',
            'email' =>  'nullable|email|unique:users,email,' . $user->id,
            'phone_number' => 'sometimes|string|min:4|max:20|unique:users,phone_number,' . $user->id,
            'street'          => 'nullable|string|max:255',
            'city'             => 'nullable|string|max:255',
            'country'       => 'nullable|string|max:50',
            'status'           => 'nullable|in:active,inactive,banned',
        ]);

        $address = $user->address;
        
        $user->update($request->only(['first_name','last_name','status']));

        $address->update($request->only(['street','city','country','state']));

        return response()->json($user);
    }
}
