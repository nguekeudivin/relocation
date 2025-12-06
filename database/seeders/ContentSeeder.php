<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('contents')->insert([
            [
                'name' => "3.5-ton Van",
                'fr' => 'Camionnette 3,5 tonnes',
                'en' => '3.5-ton Van',
                'de' => '3,5-Tonnen Transporter'
            ],
            [
                'name' => 'Minibus / Coaster',
                'fr' => 'Minibus / Coaster',
                'en' => 'Minibus / Coaster',
                'de' => 'Minibus / Coaster'
            ],
            [
                'name' => "van",
                'fr' => 'Camionnette 3,5 tonnes',
                'en' => '3.5-ton Van',
                'de' => '3,5-Tonnen Transporter'
            ],
            [
                'name' => 'bus',
                'fr' => 'Minibus / Coaster',
                'en' => 'Minibus / Coaster',
                'de' => 'Minibus / Coaster'
            ]
        ]);
    }
}
