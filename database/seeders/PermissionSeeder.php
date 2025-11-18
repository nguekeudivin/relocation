<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('permissions')->delete();

        $permissions = [
            // Instutitions
            ['name' => 'member.view', 'description' => 'View informations of a member'],
            ['name' => 'member.update', 'description' => 'Update informations of a member'],
            ['name' => 'member.delete', 'description' => 'Delete a member'],
        ];

        foreach ($permissions as $permission) {
            DB::table('permissions')->updateOrInsert(
                // Colonne(s) qui identifient l'enregistrement
                ['name' => $permission['name']],
                [
                    'description' => $permission['description'],
                    'updated_at'  => Carbon::now(),
                    'created_at'  => Carbon::now(),
                ]
            );
        }
    }
}
