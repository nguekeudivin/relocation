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
                'value' => '16',
            ],
            [
                'name' => 'Price per worker',
                'code' => 'price_per_worker',
                'description' => 'Price per worker',
                'value' => '15'
            ],
            [
                'name' => 'Available workers',
                 'code' => 'available_workers',
                'description' => 'Available workers',
                'value' => '10'
            ],
            [
                'name' => "Car fee week day monday - thursday",
                'code' => 'car_price_weekday_job',
                'description' => "Car fee week day Monday - Thursday",
                'value' => '75'
            ],
            [
                'name' => "Car fee week day friday - sunday",
                'code' => 'car_price_weekend_job',
                'description' => "Car fee week day Monday - Thursday",
                'value' => '130'
            ],
            [
                'name' => "Fee per Km",
                'code' => 'fee_per_km',
                'description' => "Fee per km",
                'value' => '0.40'
            ],
        ];

        DB::table('settings')->insert($settings);
    }
}
