<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'title', 'description', 'isActive'];

    public function modules()
    {
        return $this->hasMany(Module::class);
    }

    public function sections()
    {
        return $this->belongsToMany(Section::class, 'section_subjects', 'subject_id', 'section_id');
    }

    public function getStudentsAttribute()
    {
        return User::join('student_sections', 'users.id', '=', 'student_sections.student_id')
            ->join('section_subjects', 'student_sections.section_id', '=', 'section_subjects.section_id')
            ->where('section_subjects.subject_id', $this->id)
            ->select('users.*')
            ->get();
    }

}
