<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Slot extends Model
{
    use HasFactory;

    // Table name (optional if it matches the class name)
    protected $table = 'slots';

    // Mass assignable fields
    protected $fillable = [
        'date',
        'from_hour',
        'to_hour',
    ];

    // Casts for proper types
    protected $casts = [
        'date' => 'date',
        'to_hour' => 'datetime',
        'from_hour' => 'datetime'
    ];

    /**
     * Optional helper methods
     */

    // Get slot duration in hours
    public function durationInHours(): float
    {
        return $this->from_hour->diffInMinutes($this->to_hour) / 60;
    }

    // Format the slot for display
    public function formattedSlot(): string
    {
        return $this->date->format('Y-m-d') . ' ' . $this->from_hour->format('H:i') . ' - ' . $this->to_hour->format('H:i');
    }
}
