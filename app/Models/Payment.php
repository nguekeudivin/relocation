<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    // Payment methods
    const METHODS = ['card','giropay','sofort','klarna','sepa_debit'];

    // Payment statuses
    const STATUSES = ['pending', 'completed', 'failed']; 

    const LOAD = ['user'];

    protected $table = 'payments';

    // Mass assignable fields
    protected $fillable = [
        'user_id',
        'amount',
        'method',
        'phone_number',
        'transaction_id',
        'status',
        'processed_at',
        'callback',
    ];

    // Attribute casting
    protected $casts = [
        'amount' => 'decimal:2',
        'processed_at' => 'datetime',
        'callback' => 'array', // json column
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function isCompleted()
    {
        return $this->status === 'completed';
    }

    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function isFailed()
    {
        return $this->status === 'failed';
    }
}
