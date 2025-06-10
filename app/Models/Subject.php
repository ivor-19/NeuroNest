<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'title', 'description', 'isActive'];

    //eto yung tinatawag sa controller/ example: subjects->modules
    public function modules()
    {
        return $this->hasMany(Module::class);
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'course_subjects', 'subject_id', 'course_id');
    }

    public function getStudentsAttribute()
    {
        return User::join('student_sections', 'users.id', '=', 'student_sections.student_id')
            ->join('course_subjects', 'course_subjects.section_id', '=', 'course_subjects.section_id')
            ->where('course_subjects.subject_id', $this->id)
            ->select('users.*')
            ->get();
    }

}
