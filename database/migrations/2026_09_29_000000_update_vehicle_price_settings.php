<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Replace weekday/weekend vehicle fees with duration-based flat rates.
     */
    public function up(): void
    {
        DB::table('settings')->whereIn('code', [
            'van_price_weekday',
            'van_price_weekend',
            'bus_price_weekday',
            'bus_price_weekend',
        ])->delete();

        DB::table('settings')->insert([
            [
                'name' => 'Van flat rate per day',
                'code' => 'van_price_day',
                'description' => 'Mini LKW 3,5 Tonnen Peugeot Boxer 3.5t Koffer - rate per day',
                'value' => '135',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Van flat rate per 4 hours',
                'code' => 'van_price_4h',
                'description' => 'Mini LKW 3,5 Tonnen Peugeot Boxer 3.5t Koffer - rate for up to 4 hours',
                'value' => '100',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Bus flat rate per day',
                'code' => 'bus_price_day',
                'description' => 'Transporter Peugeot Boxer L3H2 - rate per day',
                'value' => '110',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Bus flat rate per 4 hours',
                'code' => 'bus_price_4h',
                'description' => 'Transporter Peugeot Boxer L3H2 - rate for up to 4 hours',
                'value' => '80',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        DB::table('settings')->whereIn('code', [
            'van_price_day',
            'van_price_4h',
            'bus_price_day',
            'bus_price_4h',
        ])->delete();

        DB::table('settings')->insert([
            ['name' => 'Van fee week day monday - thursday', 'code' => 'van_price_weekday', 'description' => 'Car fee week day Monday - Thursday', 'value' => '75', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Van fee week day friday - sunday', 'code' => 'van_price_weekend', 'description' => 'Van fee week day Monday - Thursday', 'value' => '130', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Bus fee week day monday - thursday', 'code' => 'bus_price_weekday', 'description' => 'Car fee week day Monday - Thursday', 'value' => '60', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Bus fee week day friday - sunday', 'code' => 'bus_price_weekend', 'description' => 'Van fee week day Monday - Thursday', 'value' => '120', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
};
