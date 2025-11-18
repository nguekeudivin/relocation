<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FinanceAccount;
use Illuminate\Support\Facades\DB;

class FinanceAccountSeeder extends Seeder
{
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        FinanceAccount::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $accounts = [
            [
                'name' => 'Caisse Menus Dépenses',
                'type' => 'cash',
                'phone_number' => null,
                'bank_name' => null,
                'account_name' => null,
                'account_number' => null,
                'description' => 'Petite caisse pour les transactions en espèces.',
                'user_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Compte Principal MTN MoMo',
                'type' => 'mtn_momo',
                'phone_number' => '677001122',
                'bank_name' => null,
                'account_name' => null,
                'account_number' => null,
                'description' => 'Compte mobile money principal pour les transactions rapides.',
                'user_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Compte Princpital Orange Money',
                'type' => 'orange_money',
                'phone_number' => '699334455',
                'bank_name' => null,
                'account_name' => null,
                'account_number' => null,
                'description' => 'Compte Orange Money principal pour les transactions rapides.',
                'user_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Compte Bancaire A Afriland',
                'type' => 'bank',
                'phone_number' => null,
                'bank_name' => 'Afriland First Bank',
                'account_name' => 'BON EPEYA NTOKO',
                'account_number' => 'CM1234567890',
                'description' => 'Compte courant pour les dépôts et retraits importants.',
                'user_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        FinanceAccount::insert($accounts);
    }
}
