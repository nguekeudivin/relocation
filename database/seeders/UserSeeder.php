<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Role;

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
        $clientRole = Role::where('code', 'client')->first();
        // Create others members.
        User::factory()
                ->count(5)
                ->create()
                ->each(function ($user) use ($clientRole) {
                    $user->attachRole($clientRole->id);
                });
    }
}