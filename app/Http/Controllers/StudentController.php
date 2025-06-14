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

        // Get only accessible modules for this student's section
        $accessibleModules = Module::where('subject_id', $subject_id)
            ->whereHas('moduleAccess', function($query) use ($classInstructor) {
                $query->where('class_instructor_id', $classInstructor->id)
                      ->where('is_available', true);
            })
            ->get();

        return Inertia::render('Student/Modules', [
            'subject' => $subject,
            'modules' => $accessibleModules,
            'instructor' => $classInstructor->instructor_name ?? 'Unknown', // if you have instructor name
        ]);
    }
}