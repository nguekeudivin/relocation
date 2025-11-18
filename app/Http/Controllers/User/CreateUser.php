<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Models\Role;
use App\Models\Asset;
use App\Models\Setting;
use App\Models\Contribution;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CreateUser extends Controller
{
    public function __invoke(Request $request)
    {
        $validated = $request->validate([
            'first_name'       => 'required|string|max:255',
            'last_name'        => 'required|string|max:255',
            'email'            => 'nullable|email|unique:users,email',
            'phone_number'     => 'required|string|max:20|min:10|unique:users,phone_number',
            'birth_date'       => 'nullable|date',
            'gender'           => 'in:male,female',
            'address'          => 'nullable|string|max:255',
            'city'             => 'nullable|string|max:255',
            //'country_id'       => 'nullable|string|max:50',
            //'national_id'      => 'nullable|string|max:50',
            'marital_status'   => 'nullable|in:single,married,widowed,divorced',
            'profession'       => 'nullable|string|max:255',
            'joined_at'        => 'required|date',
            'status'           => 'nullable|in:active,inactive,banned',
            //'password'         => 'required|string|min:6|confirmed',
        ]);

        $validated['password'] = Hash::make('password');
        DB::beginTransaction();
        $user = User::create($validated);

        // Add a member role to the user.
        $memberRole = Role::where('code','member')->first();
        $user->attachRole($memberRole->id);

        // Update image
        if ($request->hasFile('image')) {
            $user->image()->create(Asset::makePublic($request->file('image'),'users','image'));
        }

        // Create adhesion pending contribution.
        $settingAmount = Setting::find("adhesion_contribution_amount");
        $settingDueDays = Setting::find("adhesion_payment_due_days");
        Contribution::create([
            'user_id'    => $user->id,
            'amount'     => (int) $settingAmount->value,
            'type'       => 'adhesion',
            'status'     => 'pending',
            'due_date'   => Carbon::now()->copy()->addDays((int) $settingDueDays->value)->toDateString(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::commit();
        
        return response()->json($user, 201);
    }
}
