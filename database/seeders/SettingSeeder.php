<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('settings')->delete();
        
        $settings = [
            [
                'name' => 'Price per hour',
                'code' => 'price_per_hour',
                'description' => "price_per_four",
                'value' => '200',
            ],
            [
                'name' => 'Price per worker',
                'code' => 'price_per_worker',
                'description' => 'Price per worker',
                'value' => '500'
            ],
            [
                'name' => "Price per Vehicule",
                'code' => 'price_per_car',
                'description' => "Price per car",
                'value' => '1000'
            ],
        ];

        DB::table('settings')->insert($settings);
    }
}
