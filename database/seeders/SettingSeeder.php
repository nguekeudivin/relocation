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
                'name' => "Van flat rate per day",
                'code' => 'van_price_day',
                'description' => "Mini LKW 3,5 Tonnen Peugeot Boxer 3.5t Koffer - rate per day",
                'value' => '135'
            ],
            [
                'name' => "Van flat rate per 4 hours",
                'code' => 'van_price_4h',
                'description' => "Mini LKW 3,5 Tonnen Peugeot Boxer 3.5t Koffer - rate for up to 4 hours",
                'value' => '100'
            ],
            [
                'name' => "Bus flat rate per day",
                'code' => 'bus_price_day',
                'description' => "Transporter Peugeot Boxer L3H2 - rate per day",
                'value' => '110'
            ],
            [
                'name' => "Bus flat rate per 4 hours",
                'code' => 'bus_price_4h',
                'description' => "Transporter Peugeot Boxer L3H2 - rate for up to 4 hours",
                'value' => '80'
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
