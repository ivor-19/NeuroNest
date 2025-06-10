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
        return $this->belongsToMany(User::class, 'student_sections', 'course_id', 'student_id');
    }

}