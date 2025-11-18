<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Role;
use App\Models\Country;
use App\Models\Asset;

use Faker\Factory as Faker;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        // Clear the existing users to prevent duplicates on re-seeding.
        DB::table('users')->delete();
        $faker = Faker::create();

        // Get roles
        $memberRole = Role::where('code', 'member')->first();
        $adminRole = Role::where('code','admin')->first();

        $country = Country::where('code','CM')->first();

        // Create Admin
        $admin = User::factory()->create(['country_id' => $country->id, 'phone_number' => '+237655660502']);
        $admin->attachRole($memberRole->id);
        $admin->attachRole($adminRole->id);
        $admin->image()->create(Asset::getPlaceholderAvatar($admin->gender));

        // Create others members.
        User::factory()
        ->count(20)
        ->create(['country_id' => $country->id])
        ->each(function ($user) use ($memberRole) {
            $user->image()->create(Asset::getPlaceholderAvatar($user->gender));
            $user->attachRole($memberRole->id);
        });
    }
}