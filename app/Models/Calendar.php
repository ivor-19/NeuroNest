<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Calendar extends Model
{
    protected $fillable = [
        'title', 
        'description', 
        'date',
        'time',
        'type',
        'priority',
    ];
}
