<?php

namespace App\Services;

class VehiclePricing
{
    /**
     * Flat rate (forfait) for a vehicle based on the booking duration.
     *
     * - duration <= 4h  → <type>_price_4h
     * - duration > 4h   → <type>_price_day × ceil(duration / 24)
     */
    public static function flatRate(?string $carType, float $durationHours, $settings): float
    {
        if ($carType == null) {
            return 0;
        }

        if ($durationHours <= 4) {
            return (float) ($settings["{$carType}_price_4h"] ?? 0);
        }

        $days = (int) ceil($durationHours / 24);

        return $days * (float) ($settings["{$carType}_price_day"] ?? 0);
    }
}
