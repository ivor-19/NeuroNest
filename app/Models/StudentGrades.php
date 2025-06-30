<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentGrades extends Model
{
    protected $fillable = ["assessment_id", "student_id", "score"];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id', 'id');
    }

    public function assessment()
    {
        return $this->belongsTo(Assessment::class);
    }
}
