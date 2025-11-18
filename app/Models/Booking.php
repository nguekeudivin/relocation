<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    // Table name (optional if it follows Laravel naming conventions)
    protected $table = 'bookings';

    // Mass assignable fields
    protected $fillable = [
        'user_id',
        'date',
        'origin_id',
        'destination_id',
        'workers',
        'cars',
        'duration',
        'amount',
        'observation',
    ];

    // Attribute casting
    protected $casts = [
        'date' => 'datetime',
        'duration' => 'decimal:2',
        'amount' => 'decimal:2',
    ];

    /**
     * Relationships
     */

    // Booking belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Assuming origin and destination are stored in another table, e.g., "locations"
    public function origin()
    {
        return $this->belongsTo(Location::class, 'origin_id');
    }

    public function destination()
    {
        return $this->belongsTo(Location::class, 'destination_id');
    }

    /**
     * Optional helper methods
     */

    // Total number of vehicles + workers
    public function totalResources()
    {
        return $this->workers + $this->cars;
    }

    // Format amount for display
    public function formattedAmount()
    {
        return number_format($this->amount, 2);
    }
}
