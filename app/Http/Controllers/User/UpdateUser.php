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
        $validated = $request->validate([
            'first_name'       => 'sometimes|string|max:255',
            'last_name'        => 'sometimes|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $user->id,
            'phone_number' => 'sometimes|string|min:4|max:20|unique:users,phone_number,' . $user->id,
            'birth_date'       => 'nullable|date',
            'gender'           => 'nullable|in:male,female',
            'address'          => 'nullable|string|max:255',
            'city'             => 'nullable|string|max:255',
            'country_id'       => 'nullable|string|max:50',
            'marital_status'   => 'nullable|in:single,married,widowed,divorced',
            'profession'       => 'nullable|string|max:255',
            'joined_at'        => 'nullable|date',
            'status'           => 'nullable|in:active,inactive,banned',
        ]);

        $user->update($validated);

        // Check the file upload.
        if($request->hasFile("image")){
            if($user->image){
                $user->image->deleteWithFile();
            }
            $user->image()->create(Asset::makePublic($request->file('image'), 'users', 'image'));
        }

        return response()->json($user);
    }
}
