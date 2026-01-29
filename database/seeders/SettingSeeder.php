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
                'name' => 'Tax for worker',
                'code' => 'worker_tax',
                'description' => 'Tax for worker',
                'value' => '15'
            ],
             [
                'name' => "Tax for vehicle",
                'code' => 'car_tax',
                'description' => "Tax for vehicle",
                'value' => '15'
            ],
            [
                'name' => 'Available workers',
                 'code' => 'available_workers',
                'description' => 'Available workers',
                'value' => '10'
            ],
            [
                'name' => "Van fee week day monday - thursday",
                'code' => 'van_price_weekday',
                'description' => "Car fee week day Monday - Thursday",
                'value' => '75'
            ],
            [
                'name' => "Van fee week day friday - sunday",
                'code' => 'van_price_weekend',
                'description' => "Van fee week day Monday - Thursday",
                'value' => '130'
            ],
            [
                'name' => "Bus fee week day monday - thursday",
                'code' => 'bus_price_weekday',
                'description' => "Car fee week day Monday - Thursday",
                'value' => '60'
            ],
            [
                'name' => "Bus fee week day friday - sunday",
                'code' => 'bus_price_weekend',
                'description' => "Van fee week day Monday - Thursday",
                'value' => '120'
            ],
            [
                'name' => "Fee per Km",
                'code' => 'fee_per_km',
                'description' => "Fee per km",
                'value' => '0.40'
            ],
            [
                'name' => 'Notification Email',
                'code' => 'notification_email',
                'description' => "It's the email that receive the notification",
                'value' => 'kenelly391@gmail.com'
            ]
           
        ];

        DB::table('settings')->insert($settings);
    }
}
