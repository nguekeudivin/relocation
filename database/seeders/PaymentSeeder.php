<?php

namespace Database\Seeders;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        // Optional: Clear table
        // Payment::truncate();

        $users = User::pluck('id')->toArray();

        if (empty($users)) {
            $this->command->warn('⚠ No users found. Payments will not be created.');
            return;
        }

        foreach (range(1, 20) as $i) {

            $method = fake()->randomElement(Payment::METHODS);
            $status = fake()->randomElement(Payment::STATUSES);

            Payment::create([
                'user_id' => fake()->randomElement($users),
                'amount' => fake()->randomFloat(2, 10, 500),
                'method' => $method,
                'phone_number' => $method === 'mobile_money'
                    ? fake()->numerify('6########')
                    : null,
                'transaction_id' => Str::uuid()->toString(),
                'status' => $status,
                'processed_at' => $status === 'completed' ? now() : null,
                'callback' => [
                    'provider' => $method,
                    'reference' => Str::random(12),
                    'message' => $status === 'completed'
                        ? 'Payment confirmed'
                        : ($status === 'failed' ? 'Payment failed' : 'Awaiting confirmation'),
                ],
            ]);
        }

        $this->command->info('✅ PaymentSeeder: 20 payments created successfully.');
    }
}
