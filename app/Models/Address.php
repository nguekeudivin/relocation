<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $fillable = [
        'country',
        'state',
        'address',
        'lat',
        'lng',
    ];

    protected $appends = [
        'full_address'
    ];

    public function getFullAddressAttribute(): string
    {
        return $this->address ?? '';
    }
}