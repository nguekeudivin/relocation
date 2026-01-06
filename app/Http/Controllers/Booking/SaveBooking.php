<?php

namespace App\Http\Controllers\Booking;

use App\Models\Setting;
use App\Models\Booking;
use App\Models\Address;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\BookingCreatedMail;

class SaveBooking
{
    public static function call($data, $lang){

        $settings = Setting::all()->pluck('value', 'code');

        $workerTax  = (float)$settings['worker_tax'] * (float)$data['workers'];
        $durationCost = (float)$data['workers'] * (float)$settings['price_per_hour'] * (float)$data['duration'];
        $carTax  = (float)$data['transport_price'] + (float)$data['distance'] * (float)$settings['fee_per_km'] * 2;

        // Make sure that car type is correctly define.
        if(!isset($data['car_type'])){
            $carTax = 0;
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
            'amount'         => $durationCost + $carTax + $workerTax,
            'worker_tax'     => $workerTax,
            'car_tax'        => $carTax,
            'duration_cost'  => $durationCost,
            'status'         => 'pending',
        ]);

        Mail::to($booking->email)->queue(
             new BookingCreatedMail($booking, $lang)
        );

        return $booking;
    }
}
