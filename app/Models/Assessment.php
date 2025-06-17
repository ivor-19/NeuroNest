<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{
    use HasFactory;

    protected $fillable = [
        "instructor_id",
        "subject_id",
        "title",
        "description",
    ];

    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id', 'id');
    }
    
    public function subject()
    {
        return $this->belongsTo(Subject::class, 'subject_id', 'id');
    }

    public function assignments()
    {
        return $this->hasMany(AssessmentAssignment::class);
    }

}
