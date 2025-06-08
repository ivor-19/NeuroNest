<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name', 
        'year_level', 
        'semester', 
        'school_year', 
        'isActive'
    ];

    // Section has many students
    public function students()
    {
        return $this->belongsToMany(User::class, 'student_sections', 'section_id', 'student_id');
    }

    // Section has many subjects
    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'section_subjects', 'section_id', 'subject_id');
    }
}