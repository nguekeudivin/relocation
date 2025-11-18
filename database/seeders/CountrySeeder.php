<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CountrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Load and group cities by region
        DB::table('countries')->delete();
        $countries = json_decode(file_get_contents(resource_path('content/countries.json')), true);
        // Bulk insert all cities at once
        DB::table('countries')->insert($countries);
    }
}
