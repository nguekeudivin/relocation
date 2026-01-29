<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'email',
        'first_name',
        'last_name',
        'date',
        'origin_id',
        'destination_id',
        'workers',
        'car_type',
        'duration',
        'amount',
        'workers_tax',
        'car_tax',
        'transport',
        'distance_paderborn',
        'distance',
        'duration_cost',
        'observation',
        'status'
    ];

    public const STATUSES = ['pending', 'notified', 'paid', 'completed'];

    public const LOAD = ['origin', 'destination', 'user'];

    protected $casts = [
        'date' => 'datetime',
        'duration' => 'decimal:2',
        'amount' => 'decimal:2',
        'tax' => 'decimal:2'
    ];

    protected $appends = [
        'tax'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function origin()
    {
        return $this->belongsTo(Address::class, 'origin_id');
    }

    public function destination()
    {
        return $this->belongsTo(Address::class, 'destination_id');
    }

    public function getTaxAttribute()
    {
        return $this->worker_tax + $this->car_tax;
    }
}
