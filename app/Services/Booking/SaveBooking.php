<?php

namespace App\Services\Booking;

use App\Models\Setting;
use App\Models\Booking;
use App\Models\Address;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\Booking\BookingCreatedMail;
use App\Mail\Booking\BookingCreatedAdminMail;

class SaveBooking
{
    public static function run($data, $lang = 'en'){

        $settings = Setting::all()->pluck('value', 'code');

        $workersCost  = $settings['price_per_worker'] * $data['workers'];
        $durationCost = $data['workers'] * $settings['price_per_hour']    * $data['duration'];
        $carsCost     = $data['transport_price'];

        $taxCost = $settings['worker_tax'];

        // Make sure that car type is correctly define.
        if(isset($data['car_type'])){
            $taxCost = $settings['worker_tax'] + $settings['car_tax'];
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
            'amount'         => $workersCost + $durationCost + $carsCost,
            'tax'            => $taxCost,
            'status'         => 'pending',
        ]);

        Mail::to($booking->email)->queue(
             new BookingCreatedMail($booking, $lang)
        );

        Mail::to(User::getAdmin()->email)->queue(
            new BookingCreatedAdminMail($booking)
        );

        return $booking;
    }
}
