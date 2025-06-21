<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssessmentAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        "assessment_id",
        "course_id",
        "year_level",
        "section",
        "is_available",
        "opened_at",
        "closed_at",
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function assessment()
    {
        return $this->belongsTo(Assessment::class);
    }

    public function students()
    {
        return $this->hasManyThrough(
            StudentProfile::class,
            StudentResponse::class,
            'assessment_id', // Foreign key on student_responses table
            'id',           // Foreign key on student_profiles table
            'assessment_id', // Local key on assessment_assignments table
            'student_id'    // Local key on student_responses table
        );
    }
}
