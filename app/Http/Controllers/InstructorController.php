<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\ClassInstructor;
use App\Models\Module;
use App\Models\ModuleAccess;
use App\Models\StudentProfile;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InstructorController extends Controller
{
    public function dashboard(){
        $instructorId = auth()->id();
    
        // Get sections with course and the specific subject assigned to instructor
        $sections = ClassInstructor::with([
                'course' => function($query) {
                    $query->where('isActive', 1);
                },
                'subject' => function($query) {
                    $query->where('isActive', 1); // Filter active subjects
                }
            ])
            ->where('instructor_id', $instructorId)
            ->whereHas('course', function($query) {
                $query->where('isActive', 1);
            })
            ->whereHas('subject', function($query) {
                $query->where('isActive', 1);
            })
            ->get()
            ->map(function ($section) {
                // Get student count for this section
                $studentCount = StudentProfile::where('course_id', $section->course_id)
                    ->where('year_level', $section->year_level)
                    ->where('section', $section->section)
                    ->count();
    
                // Get the specific subject assigned to this instructor for this section
                $subject = [
                    'id' => $section->subject->id,
                    'code' => $section->subject->code,
                    'title' => $section->subject->title,
                    'description' => $section->subject->description,
                    'year_level' => $section->subject->year_level,
                    'semester' => $section->subject->semester,
                    'isActive' => $section->subject->isActive
                ];
    
                return [
                    'id' => $section->id,
                    'instructor_id' => $section->instructor_id,
                    'course_id' => $section->course_id,
                    'subject_id' => $section->subject_id,
                    'year_level' => $section->year_level,
                    'section' => $section->section,
                    'course_code' => $section->course->code,
                    'course_name' => $section->course->name,
                    'student_count' => $studentCount,
                    'subject' => $subject // Single subject, not array of subjects
                ];
            });
    
        return Inertia::render('Instructor/Dashboard', [
            'sections' => $sections
        ]);
    }

    public function sections(){
        $instructorId = auth()->id();
    
        // Get sections with course and the specific subject assigned to instructor
        $sections = ClassInstructor::with([
                'course' => function($query) {
                    $query->where('isActive', 1);
                },
                'subject' => function($query) {
                    $query->where('isActive', 1); // Filter active subjects
                }
            ])
            ->where('instructor_id', $instructorId)
            ->whereHas('course', function($query) {
                $query->where('isActive', 1);
            })
            ->whereHas('subject', function($query) {
                $query->where('isActive', 1);
            })
            ->get()
            ->map(function ($section) {
                // Get student count for this section
                $studentCount = StudentProfile::where('course_id', $section->course_id)
                    ->where('year_level', $section->year_level)
                    ->where('section', $section->section)
                    ->count();
    
                // Get the specific subject assigned to this instructor for this section
                $subject = [
                    'id' => $section->subject->id,
                    'code' => $section->subject->code,
                    'title' => $section->subject->title,
                    'description' => $section->subject->description,
                    'year_level' => $section->subject->year_level,
                    'semester' => $section->subject->semester,
                    'isActive' => $section->subject->isActive
                ];
    
                return [
                    'id' => $section->id,
                    'instructor_id' => $section->instructor_id,
                    'course_id' => $section->course_id,
                    'subject_id' => $section->subject_id,
                    'year_level' => $section->year_level,
                    'section' => $section->section,
                    'course_code' => $section->course->code,
                    'course_name' => $section->course->name,
                    'student_count' => $studentCount,
                    'subject' => $subject // Single subject, not array of subjects
                ];
            });
    
        return Inertia::render('Instructor/Sections', [
            'sections' => $sections
        ]);
    }

    public function modules(Request $request)
    {
        $instructorId = auth()->id();

        $courseId = $request->query('course_id');
        $yearLevel = $request->query('year_level');
        $section = $request->query('section');
        $subjectId = $request->query('subject_id');

        $classInstructor = ClassInstructor::where('instructor_id', $instructorId)
            ->where('course_id', $courseId)
            ->where('year_level', $yearLevel)
            ->where('section', $section)
            ->where('subject_id', $subjectId)
            ->with(['subject', 'course'])
            ->firstOrFail();

        $modules = ModuleAccess::where('class_instructor_id', $classInstructor->id)
            ->with('module')
            ->get();

        $assessmentList = Assessment::with(['subject', 'instructor'])
            ->where('instructor_id', $instructorId)
            ->where('subject_id', $classInstructor->subject_id) // ← filter by subject
            ->get();


        return Inertia::render('Instructor/Modules', [
            'classInstructor' => $classInstructor,
            'modules' => $modules,
            'assessments' => $assessmentList,
        ]);
    }

    public function moduleAvailability($id)
    {
        $moduleAccess = ModuleAccess::findOrFail($id);
        
        // Toggle the is_available status
        $moduleAccess->is_available = !$moduleAccess->is_available;
        $moduleAccess->save();
        
        return redirect()->back();
    }
}
