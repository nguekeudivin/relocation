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
                'name' => 'Montant contribution mensuel',
                'code' => 'monthly_contribution_amount',
                'description' => "Le montant qu'il faut verser pour une contribution mensuel",
                'value' => '10000',
            ],
            [
                'name' => 'Date limite contribution mensuel',
                'code' => 'monthly_contribution_due_days',
                'description' => 'Date limite des contributions mensuel. Une fois passe cette date les contributions sont marques impayes',
                'value' => '15'
            ],
            [
                'name' => "Montant de l'adhesion",
                'code' => 'adhesion_contribution_amount',
                'description' => "Le montant qu'il faut payer pour adherer ou avoir acces a la reuinion",
                'value' => '10000'
            ],
            [
                'name' => "Adhesion paiment due days",
                'code' => 'adhesion_payment_due_days',
                'description' => "Le nombre de jour d'echeance pour payer l'adhesion une fois enregistrer",
                'value' => '7'
            ],
            [
                'name' => "Help transaction due days",
                'code' => 'help_transaction_due_days',
                'description' => "Le nombre de jour d'echeance pour transferer les fonds de l'entraide",
                'value' => '7'
            ],
            [
                'name' => "Meeting support amount",
                'code' => 'meeting_support_amount',
                'description' => "Le montant a payer ",
                'value' => '2000'
            ]
        ];

        DB::table('settings')->insert($settings);
    }
}
