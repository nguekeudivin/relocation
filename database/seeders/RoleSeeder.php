<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('roles')->delete();

        // Création des rôles
        $roles = [
            'Administrateur' => [
                'description' => 'Manage the entire application',
                'permissions' => 'ALL',
                'code' => 'admin',
                'type' => 'admin'
            ],
            'Member' => [
                'description' => 'A Member of the association',
                'permissions' => [
                ],
                'code' => 'member',
                'type' => 'member'
            ],
        ];

        foreach ($roles as $name => $data) {
            // Insère le rôle
            $roleId = DB::table('roles')->insertGetId([
                'name' => $name,
                'description' => $data['description'],
                'code' => $data['code'],
                'type' => $data['type'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);

            // Associe les permissions
            if ($data['permissions'] === 'ALL') {
                $permissions = DB::table('permissions')->pluck('id');
            } else {
                $permissions = DB::table('permissions')
                    ->whereIn('name', $data['permissions'])
                    ->pluck('id');
            }

            foreach ($permissions as $permissionId) {
                DB::table('role_permission')->updateOrInsert([
                    'role_id' => $roleId,
                    'permission_id' => $permissionId,
                ]);
            }
        }
    }
}
