<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name'           => $this->faker->firstName,
            'last_name'            => $this->faker->lastName,
            'email'                => $this->faker->unique()->safeEmail,
            'phone_number' =>       $this->faker->numerify('+2376########'),
            'email_verified_at'    => $this->faker->optional()->dateTimeThisYear,
            'password'             => Hash::make('password'), // all users get "password"
            'current_user_role_id' => null, // adjust if you seed roles
            'remember_token'       => Str::random(10),
        ];
    }
}
