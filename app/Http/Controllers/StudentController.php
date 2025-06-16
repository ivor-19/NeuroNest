<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function dashboard()
    {
        $user = auth()->user();
        
        return Inertia::render('Student/Dashboard', [
            'user' => $user,
            'subjects' => $user->subjects, // This will automatically use your getSubjectsAttribute()
        ]);
    }

    public function modules($subject_id)
    {
        $user = auth()->user();
        $subject = Subject::findOrFail($subject_id);
        $classInstructor = $user->getClassInstructorForSubject($subject_id);
    
        if (!$classInstructor) {
            return Inertia::render('Student/Modules', [
                'subject' => $subject,
                'modules' => collect([]),
                'message' => 'No instructor assigned to your section for this subject yet.'
            ]);
        }
    
        $modules = Module::where('subject_id', $subject_id)
            ->with(['moduleAccess' => function($query) use ($classInstructor) {
                $query->where('class_instructor_id', $classInstructor->id);
            }])
            ->with(['completions' => function($query) use ($user) {
                $query->where('student_id', $user->id);
            }])
            ->get()
            ->map(function($module) {
                $isAvailable = optional($module->moduleAccess->first())->is_available ?? false;
                $isDone = $module->completions->isNotEmpty();
    
                return [
                    'id' => $module->id,
                    'title' => $module->title,
                    'description' => $module->description,
                    'pdf' => $module->pdf,
                    'isActive' => $isAvailable,
                    'isDone' => $isDone, // Simple boolean
                    'type' => 'reading',
                    'status' => $isAvailable ? ($isDone ? 'done' : 'available') : 'disabled'
                ];
            });
    
        return Inertia::render('Student/Modules', [
            'subject' => $subject,
            'modules' => $modules,
            'instructor' => $classInstructor->instructor->name ?? 'Unknown',
        ]);
    }
}