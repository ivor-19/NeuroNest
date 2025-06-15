<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    use HasFactory;

    protected $fillable = ['subject_id', 'creator_id', 'title', 'description', 'order', 'status', 'materials', 'pdf'];

    public function subject()
    {
        return $this->belongsTo(Subject::class, 'subject_id', 'id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id', 'id');
    }

    public function courseSubjects()
    {
        return $this->hasMany(CourseSubject::class, 'subject_id', 'subject_id');
    }

    public function moduleAccess()
    {
        return $this->hasMany(ModuleAccess::class);
    }

   // Auto-create access records when new module is created
   protected static function booted()
   {
       static::created(function ($module) {
           $classInstructors = ClassInstructor::where('subject_id', $module->subject_id)->get();
           
           foreach ($classInstructors as $classInstructor) {
               ModuleAccess::create([
                   'module_id' => $module->id,
                   'class_instructor_id' => $classInstructor->id,
                   'is_available' => true
               ]);
           }
       });
   }
}

