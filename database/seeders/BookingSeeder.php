<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Booking;
use App\Models\Address;
use Illuminate\Database\Seeder;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Récupérer tous les utilisateurs (id + email uniquement)
        $users = User::select('id', 'email')->get();

        if ($users->isEmpty()) {
            $this->command->warn('Aucun utilisateur trouvé → toutes les réservations seront anonymes.');
        }

        // 2. Créer des adresses si on en a moins de 20
        if (Address::count() < 20) {
            foreach (range(1, 20) as $i) {
                Address::create([
                    'country' => 'Germany',
                    'state'   => fake()->state(),
                    'city'    => fake()->city(),
                    'street'  => fake()->streetAddress(),
                ]);
            }
            $this->command->info('20 adresses fictives créées.');
        }

        $addresses = Address::pluck('id')->toArray();
        $totalBookings = 0;

        // === Réservations pour les utilisateurs existants (70 % des cas) ===
        foreach ($users as $user) {
            $bookingsCount = fake()->numberBetween(1, 4);

            for ($i = 0; $i < $bookingsCount; $i++) {
                // 70 % de chance que ce soit une réservation authentifiée
                if (fake()->boolean(70)) {
                    $this->createBooking([
                        'user_id' => $user->id,
                        'email'   => $user->email,
                    ], $addresses);
                    $totalBookings++;
                }
            }
        }

        // === Réservations anonymes (guests) – toujours avec email ===
        $guestBookings = fake()->numberBetween(20, 50);

        for ($i = 0; $i < $guestBookings; $i++) {
            $this->createBooking([
                'user_id' => null,
                'email'   => fake()->unique()->safeEmail(), // email réaliste mais fictif
            ], $addresses);
            $totalBookings++;
        }

        $this->command->info("Terminé ! {$totalBookings} réservations créées (authentifiées + anonymes).");
    }

    private function createBooking(array $userData, array $addresses): void
    {
        $origin = fake()->randomElement($addresses);
        $destination = $origin;

        // S’assurer que origin ≠ destination
        while ($destination === $origin) {
            $destination = fake()->randomElement($addresses);
        }

        Booking::create([
            'user_id'        => $userData['user_id'] ?? null,
            'email'          => $userData['email'],
            'date'           => fake()->dateTimeBetween('+1 day', '+90 days'),
            'origin_id'      => $origin,
            'destination_id' => $destination,
            'workers'        => fake()->numberBetween(1, 6),
            'car_type'       => fake()->randomElement(['van', 'bus']),
            'duration'       => fake()->randomFloat(2, 0.5, 12),
            'amount'         => fake()->randomFloat(2, 50, 1500),
            'observation'    => fake()->boolean(35) ? fake()->realText(180) : null,
            //'status'         => fake()->randomElement(Booking::STATUSES),
            'status' => 'pending'
        ]);
    }
}