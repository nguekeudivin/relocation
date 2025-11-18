<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();
        DB::table('categories')->delete();

        $categories = [
            [
                'name' => 'Materiels',
                'type' => 'expense',
                'description' => '',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Deplacement',
                'type' => 'expense',
                'description' => '',
                'created_at' => $now,
                'updated_at' => $now,
            ]
        ];

        DB::table('categories')->insert($categories);
    }
}
