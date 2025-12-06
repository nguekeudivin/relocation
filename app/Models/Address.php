<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $fillable = [
        'country',
        'state',
        'city',
        'street'
    ];

    protected $appends = [
        'full_address'
    ];

    public function getFullAddressAttribute(){
        return $this->country." ".$this->state." ".$this->city." ".$this->street;
    }
}
