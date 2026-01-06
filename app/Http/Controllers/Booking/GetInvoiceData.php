<?php 

namespace App\Http\Controllers\Booking;

use App\Models\Setting;

class GetInvoiceData 
{

    public static function call($booking){
            
        $settings = Setting::all()->pluck('value', 'code');
            
            return [
                // Invoice Header Data [cite: 8]
                'facture_no'   => 'AR-' . $booking->id,
                'date'         => now()->format('d.m.Y'),
                'echeance'     => $booking->date->subDays(5)->format('d.m.Y'), // Due 5 days before service [cite: 8]
                
                'client_name'  => trim(($booking->first_name ?? '') . ' ' . ($booking->last_name ?? '')) ?: ($booking->user->full_name ?? $booking->email),
                'client_street'=> $booking->origin->street ?? 'N/A',
                'client_city'  => trim(($booking->origin->zip ?? '') . ' ' . ($booking->origin->city ?? '')),
                
                'date' => $booking->date->format('d.m.Y'),
                'workers'      => $booking->workers,
                'duration'     => $booking->duration,
                
                'worker_tax_unit'  => (float)$settings['worker_tax'],
                'worker_tax_total' => $booking->worker_tax,
                'vehicle_tax'      => $booking->car_tax,
                'price_per_hour'   => (float)($settings['price_per_hour']),
                'prestation_cost'  => $booking->duration_cost,
                'total_service'    => $booking->amount,
                'booking_fee'      => $booking->worker_tax + $booking->car_tax,

                'description' => t("Provision of a moving service including :workers assistants :transport for a total duration of up to :duration working hours. The total cost of the service is :price €, which includes the initial booking fees required to secure the date.", 
                            [
                                'workers'  => $booking->workers,
                                'duration' => $booking->duration,
                                'price'    => number_format($booking->amount, 2),
                                'transport' => $booking->car_type == null ? '' : 'and a '.($booking->car_type == 'bus' ? t('bus') : t('van'))
                            ]
                ),
                'email' => 'kenelly391@gmail.com',
                'tel'   => '0151 47353235',
                'bank'  => 'N26',
                'iban'  => 'DE48 1001 1001 2449 0734 77',
                'owner' => 'Boris Arnold',
                'bic'   => 'NTSBDEB1XXX'
            ];
    }
}