<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $fillable = [
        'country',
        'state',
        'city',
        'street',
        'postal_code'
    ];

    protected $appends = [
        'full_address'
    ];

    public function getFullAddressAttribute(): string
    {
        return collect([
            $this->street,
            $this->postal_code ? $this->postal_code . ' ' . $this->city : $this->city,
            $this->state,
            $this->country
        ])
        ->filter() 
        ->implode(', '); 
    }
}