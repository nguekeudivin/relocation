<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = Role::where('code','admin')->first();
        $admin = User::create([
            'first_name' => 'Arnold',
            'last_name' => 'Umzug',
            'email' => 'eta4272@gmail.com',
            'phone_number' => '+490151473',
            'password' => Hash::make('password'),
        ]);

        $admin->attachRole($adminRole->id);
    }
}
