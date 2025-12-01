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
        $users = User::pluck('id')->toArray();

        if (empty($users)) {
            $this->command->warn('⚠ No users found — no bookings will be created.');
            return;
        }

        // Ensure addresses exist
        if (Address::count() < 10) {
            foreach (range(1, 10) as $i) {
                Address::create([
                    'country' => 'Germany',
                    'state'   => fake()->state(),
                    'city'    => fake()->city(),
                    'street'  => fake()->streetAddress(),
                ]);
            }

            $this->command->info("🏠 Created 10 dummy addresses.");
        }

        $addresses = Address::pluck('id')->toArray();

        foreach ($users as $userId) {

            // Each user has 1–3 bookings
            $bookingsCount = rand(1, 3);

            foreach (range(1, $bookingsCount) as $i) {

                $origin = fake()->randomElement($addresses);
                $destination = fake()->randomElement($addresses);

                // Ensure origin != destination
                while ($destination === $origin) {
                    $destination = fake()->randomElement($addresses);
                }

                $status = fake()->randomElement(Booking::STATUSES);

                if(rand(1,0)){
                    Booking::create([
                        'user_id'       => $userId,
                        'date'          => fake()->dateTimeBetween('+1 day', '+1 month'),
                                    'origin_id'     => $origin,
                                    'destination_id'=> $destination,
                                    'workers'       => fake()->numberBetween(1, 4),
                                    'car_type'      => fake()->randomElement(['van','bus']),
                                    'duration'      => fake()->randomFloat(2, 1, 8),
                                    'amount'        => fake()->randomFloat(2, 50, 500),
                                    'observation'   => fake()->boolean(30) ? fake()->sentence() : null,
                                    'status'        => $status,
                                    'email' => fake()->unique()->safeEmail,
                    ]);
                }else{
                    Booking::create([
                                    'date'          => fake()->dateTimeBetween('+1 day', '+1 month'),
                                    'origin_id'     => $origin,
                                    'destination_id'=> $destination,
                                    'workers'       => fake()->numberBetween(1, 4),
                                    'car_type'      => fake()->randomElement(['van','bus']),
                                    'duration'      => fake()->randomFloat(2, 1, 8),
                                    'amount'        => fake()->randomFloat(2, 50, 500),
                                    'observation'   => fake()->boolean(30) ? fake()->sentence() : null,
                                    'status'        => $status,
                                    'email' => fake()->unique()->safeEmail,
                    ]);
                }

                
            }
        }

        $this->command->info("✅ Bookings created: every user now has at least one booking.");
    }
}
