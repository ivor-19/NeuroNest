<?php

namespace App\Http\Controllers;

use App\Models\AssessmentAssignment;
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

    public function assessment()
    {
        $user = auth()->user()->load('studentSection');
        $studentProfile = $user->studentSection;
        
        if (!$studentProfile) {
            return redirect()->back()->with('error', 'Student profile not found.');
        }
        
        $assessments = AssessmentAssignment::with([
                'assessment.questions', 
                'assessment.subject', // Add subject relationship
                'course'
            ])
            ->with(['assessment' => function($query) {
                $query->withSum('questions', 'points');
            }])
            ->where('course_id', $studentProfile->course_id)
            ->where('year_level', $studentProfile->year_level)
            ->where('section', $studentProfile->section)
            ->where(function($query) {
                $query->whereNull('opened_at')
                    ->orWhere('opened_at', '<=', now());
            })
            ->where(function($query) {
                $query->whereNull('closed_at')
                    ->orWhere('closed_at', '>=', now());
            })
            ->get()
            ->map(function ($assignment) {
                // Add total_points to the assessment object for easier frontend access
                $assignment->assessment->total_points = $assignment->assessment->questions_sum_points;
                return $assignment;
            });
        
        return Inertia::render('Student/Assessment', [
            'assessments' => $assessments,
            'studentProfile' => $studentProfile
        ]);
    }
}