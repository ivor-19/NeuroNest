<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'account_id',
        'email',
        'status',
        'remarks',
        'contact_number',
        'password',
        'role',
    ];

    public function isStudent()
    {
        return $this->role === 'student';
    }

    public function isInstructor()
    {
        return $this->role === 'instructor';
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    //Relationships for sections
    public function courses()
    {
        return $this->belongsToMany(Course::class, 'student_profiles', 'student_id', 'course_id');
    }

    //Method to get all subjects from all courses the student is on

    public function studentSection()
    {
        return $this->hasOne(StudentProfile::class, 'student_id');
    }

    public function classInstructor()
    {
        return $this->hasMany(ClassInstructor::class, 'instructor_id', 'id');
    }

    public function getSubjectsAttribute()
    {
        if (!$this->studentSection) {
            return collect();
        }
    
        return Subject::with(['classInstructors' => function($query) {
                $query->where('course_id', $this->studentSection->course_id)    // Added course_id
                      ->where('year_level', $this->studentSection->year_level)
                      ->where('section', $this->studentSection->section)
                      ->with('instructor'); // Load the instructor relationship
            }])
            ->whereHas('classInstructors', function($query) {
                $query->where('course_id', $this->studentSection->course_id)    // Added course_id
                      ->where('year_level', $this->studentSection->year_level)
                      ->where('section', $this->studentSection->section);
            })
            ->get()
            ->map(function($subject) {
                // Add instructor info directly to the subject
                $classInstructor = $subject->classInstructors->first();
                $subject->instructor_name = $classInstructor ? $classInstructor->instructor->name : 'TBA';
                $subject->instructor_email = $classInstructor ? $classInstructor->instructor->email : null;
                return $subject;
            });
    }

    public function getClassInstructorForSubject($subjectId)
    {
        // Check if student has profile
        if (!$this->studentSection) {
            return null;
        }

        return ClassInstructor::where('course_id', $this->studentSection->course_id)
            ->where('year_level', $this->studentSection->year_level)
            ->where('section', $this->studentSection->section)
            ->where('subject_id', $subjectId)
            ->first();
    }
}
