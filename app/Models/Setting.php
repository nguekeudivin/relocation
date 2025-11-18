<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    // Déclare que la clé primaire est 'id' et de type string
    protected $primaryKey = 'code';
    public $incrementing = false; // parce que ce n’est pas un entier auto-incrémenté
    protected $keyType = 'string';

    // Champs assignables en masse
    protected $fillable = [
        'code',
        'name',
        'description',
        'value',
        'meta',
    ];

    // Cast JSON automatiquement
    protected $casts = [
        'meta' => 'array',
    ];
}
