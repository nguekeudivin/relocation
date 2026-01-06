<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // Add seeder here.
            PermissionSeeder::class,
            RoleSeeder::class,
            //UserSeeder::class,
            AdminSeeder::class,
            SettingSeeder::class,
        ]);
    }
}
