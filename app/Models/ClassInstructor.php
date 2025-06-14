<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassInstructor extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'instructor_id', 
        'subject_id', 
        'course_id',
        'year_level',
        'section'
    ];
    
    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id', 'id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id', 'id');
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class, 'subject_id', 'id');
    }

    public function moduleAccess()
    {
        return $this->hasMany(ModuleAccess::class);
    }

    // Auto-create module access when class instructor is created
    protected static function booted()
    {
        static::created(function ($classInstructor) {
            $modules = Module::where('subject_id', $classInstructor->subject_id)->get();
            
            foreach ($modules as $module) {
                ModuleAccess::create([
                    'module_id' => $module->id,
                    'class_instructor_id' => $classInstructor->id,
                    'is_available' => true
                ]);
            }
        });
    }
}
