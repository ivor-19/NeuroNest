<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'code', 
        'name', 
        'description', 
        'isActive'
    ];

    // Section has many students
    public function students()
    {
        return $this->belongsToMany(User::class, 'student_profiles', 'course_id', 'student_id');
    }

    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'course_subjects', 'course_id', 'subject_id');
    }

}