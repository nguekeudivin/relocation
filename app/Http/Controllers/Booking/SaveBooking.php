<?php

namespace App\Http\Controllers\Booking;

use App\Mail\AdminBookingCreatedMail;
use App\Models\Setting;
use App\Models\Booking;
use App\Models\Address;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\BookingCreatedMail;

class SaveBooking
{
    public static function call($data, $lang){

        $distancePaderborn = $data['distance_paderborn'] ?? 0;
        $distance = $data['distance'] ?? 0;

        $settings = Setting::all()->pluck('value', 'code');

        $workerTax  = (float)$settings['worker_tax'] * (float)$data['workers'];

        $carTax = (float)$settings['car_tax'];

        $durationCost = (float)$data['workers'] * (float)$settings['price_per_hour'] * (float)$data['duration'];

        $carTransport  = (float)$data['transport_price'] + (float)$distance * (float)$settings['fee_per_km'] * 2;
        $paderbornTransport = (float)$distancePaderborn * (float)$settings['fee_per_km'] * 2;

        $transport = $carTransport + $paderbornTransport;

        // Make sure that car type is correctly define.
        if(!isset($data['car_type'])){
            $carTax = 0;
            $transport = $paderbornTransport;
        }

        $origin = Address::create([
            'city'   => $data['from_city'],
            'street' => $data['from_street'],
        ]);

        $destination = Address::create([
            'city'   => $data['to_city'],
            'street' => $data['to_street'],
        ]);

        $user = null;
        if(isset($data['user_id'])){
            $user = User::find($data['user_id']);
            if($user == null){
                throw  throw new \Exception(t('Something wrong happens. Please make sure you are connected to you account'));
            }
            $data['email'] = $user->email;
        };

        $booking = Booking::create([
            'user_id'        => $data['user_id'],
            'origin_id'      => $origin->id,
            'destination_id' => $destination->id, 
            'date'           => $data['date'],
            'workers'        => $data['workers'],
            'duration'       => $data['duration'],
            'car_type'       => isset($data['car_type']) ? $data['car_type'] : null,
            'email'          => $data['email'],
            'first_name'     => isset($data['first_name']) ? $data['first_name'] : null,
            'last_name'      => isset($data['last_name']) ? $data['last_name'] : null,
            'amount'         => $durationCost + $carTax + $workerTax + $transport,
            'workers_tax'     => $workerTax,
            'car_tax'        => $carTax,
            'distance'       => (float)$data['distance'],
            'distance_paderborn' => (float)$data['distance_paderborn'],
            'transport'      => $transport,
            'duration_cost'  => $durationCost,
            'status'         => 'pending',
        ]);

        Mail::to($booking->email)->queue(
            new BookingCreatedMail($booking, $lang)
        );
        
        Mail::to($settings['notification_email'])->queue(
            new AdminBookingCreatedMail($booking, $lang)
        );

        return $booking;
    }
}
