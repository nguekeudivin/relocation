<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Slot;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class SlotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // On prend tout le mois en cours
        $now   = Carbon::now();
        $start = $now->copy()->startOfMonth();           // 1er du mois à 00:00
        $end   = $now->copy()->endOfMonth();             // dernier jour à 23:59:59

        // On crée un period jour par jour
        $period = CarbonPeriod::create($start, '1 day', $end);

        $slotsToInsert = [];

        foreach ($period as $day) {
            // On ne crée des slots que les jours ouvrés (lundi → vendredi)
            // Supprime ou commente cette condition si tu veux aussi le week-end
            if ($day->isWeekend()) {
                continue;
            }

            // Exemple d'horaires : 08h00-12h00 et 14h00-18h00
            $morningFrom = $day->copy()->setTime(8, 0);
            $morningTo   = $day->copy()->setTime(12, 0);

            $afternoonFrom = $day->copy()->setTime(14, 0);
            $afternoonTo   = $day->copy()->setTime(18, 0);

            $slotsToInsert[] = [
                'date'       => $day->toDateString(),
                'from_hour'  => $morningFrom,
                'to_hour'    => $morningTo,
                'description'=> 'Matinée',
                'created_at' => now(),
                'updated_at' => now(),
            ];

            $slotsToInsert[] = [
                'date'       => $day->toDateString(),
                'from_hour'  => $afternoonFrom,
                'to_hour'    => $afternoonTo,
                'description'=> 'Après-midi',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Insertion par lots = très rapide même pour des milliers de lignes
        Slot::insert($slotsToInsert);

        $this->command->info('Slots créés pour le mois de ' . $now->translatedFormat('F Y') . ' !');
    }
}