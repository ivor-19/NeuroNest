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
        
        // Find subject
        $subject = Subject::findOrFail($subject_id);
        
        // Get the class instructor for this student's section and subject
        $classInstructor = $user->getClassInstructorForSubject($subject_id);
        
        if (!$classInstructor) {
            // No instructor assigned to this section for this subject
            return Inertia::render('Student/Modules', [
                'subject' => $subject,
                'modules' => collect([]), // empty collection
                'message' => 'No instructor assigned to your section for this subject yet.'
            ]);
        }
    
        // Get ALL modules for this subject with their access status
        $modules = Module::where('subject_id', $subject_id)
            ->with(['moduleAccess' => function($query) use ($classInstructor) {
                $query->where('class_instructor_id', $classInstructor->id);
            }])
            ->get()
            ->map(function($module) use ($classInstructor) {
                // Check if this module is accessible for this section
                $moduleAccess = $module->moduleAccess->first();
                $isAvailable = $moduleAccess ? $moduleAccess->is_available : false;
                
                return [
                    'id' => $module->id,
                    'title' => $module->title,
                    'description' => $module->description,
                    'isActive' => $isAvailable,  // This controls if module is enabled/disabled
                    'isCompleted' => false, // You can add completion logic here later
                    'duration' => $module->duration ?? '30 min', // Add duration to your module model
                    'type' => 'reading', // Add type to your module model or set default
                    'status' => $isAvailable ? 'available' : 'disabled'
                ];
            });
    
        return Inertia::render('Student/Modules', [
            'subject' => $subject,
            'modules' => $modules,
            'instructor' => $classInstructor->instructor->name ?? 'Unknown',
        ]);
    }
}