<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\AssessmentAssignment;
use App\Models\Calendar;
use App\Models\ClassInstructor;
use App\Models\Course;
use App\Models\Module;
use App\Models\ModuleAccess;
use App\Models\StudentGrades;
use App\Models\StudentProfile;
use App\Models\Subject;
use Illuminate\Auth\Events\Registered;
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
                    'isActive' => $section->subject->isActive,
                    'image' => $section->subject->image,
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
                    'image' => $section->image,
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
                    'isActive' => $section->subject->isActive,
                    'image' => $section->subject->image,
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
                    'image' => $section->image,
                    'student_count' => $studentCount,
                    'subject' => $subject // Single subject, not array of subjects
                ];
            });
    
        return Inertia::render('Instructor/Sections', [
            'sections' => $sections
        ]);
    }

   // Shared Data method
    private function getSharedData(Request $request)
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
            ->where('subject_id', $classInstructor->subject_id)
            ->get();
            
        $assessmentAssignment = AssessmentAssignment::with(['assessment', 'course'])
            ->where('course_id', $courseId)
            ->whereHas('assessment', function ($query) use ($instructorId) {
                $query->where('instructor_id', $instructorId);
            })
            ->get();
        
        return [
            'classInstructor' => $classInstructor,
            'modules' => $modules,
            'assessments' => $assessmentList,
            'assignments' => $assessmentAssignment,
        ];
    }

    public function modules(Request $request)
    {
        $data = $this->getSharedData($request);
        return Inertia::render('Instructor/Modules', $data);
    }

    public function assessments(Request $request)
    {
        $data = $this->getSharedData($request);
        return Inertia::render('Instructor/Assessments', $data);
    }

    public function calendar() {
        $allEvent = Calendar::all();
        return Inertia::render('Instructor/Calendar', [
            'eventsData' => $allEvent,
        ]);
    }

    public function grades()
    {
        // Get the authenticated instructor
        $instructor = auth()->user();
        
        // Load all ACTIVE subjects taught by this instructor with their assessments
        $subjects = Subject::with(['classInstructors' => function($query) use ($instructor) {
                $query->where('instructor_id', $instructor->id);
            }])
            ->whereHas('classInstructors', function($query) use ($instructor) {
                $query->where('instructor_id', $instructor->id);
            })
            ->where('isActive', true)  // Only get active subjects
            ->get()
            ->map(function($subject) {
                // Get the class instructor details
                $classInstructor = $subject->classInstructors->first();
                
                // Load assessments for each subject
                $assessments = Assessment::with(['assignments', 'questions'])
                    ->where('subject_id', $subject->id)
                    ->get()
                    ->map(function($assessment) {
                        // Load grades for each assessment
                        $assessment->grades = StudentGrades::with('student')
                            ->where('assessment_id', $assessment->id)
                            ->get();
                        return $assessment;
                    });
                
                // Load course information
                $course = Course::find($classInstructor->course_id);
                
                // Load students enrolled in this subject (same course, year_level, and section)
                $students = StudentProfile::with('student')
                    ->where('course_id', $classInstructor->course_id)
                    ->where('year_level', $classInstructor->year_level)
                    ->where('section', $classInstructor->section)
                    ->get()
                    ->map(function($profile) {
                        return [
                            'id' => $profile->student_id,
                            'name' => $profile->student->name,
                            'email' => $profile->student->email,
                            'profile' => $profile->only(['year_level', 'section']),
                        ];
                    });
                
                return [
                    'id' => $subject->id,
                    'code' => $subject->code,
                    'title' => $subject->title,
                    'course' => $course,
                    'assessments' => $assessments,
                    'year_level' => $classInstructor->year_level,
                    'section' => $classInstructor->section,
                    'students' => $students,
                ];
            });

        return Inertia::render('Instructor/Grades', [
            'instructor' => [
                'id' => $instructor->id,
                'name' => $instructor->name,
                'email' => $instructor->email,
            ],
            'subjects' => $subjects,
            'assessmentTypes' => [
                ['value' => 'quiz', 'label' => 'Quiz'],
                ['value' => 'exam', 'label' => 'Exam'],
                ['value' => 'project', 'label' => 'Project'],
                ['value' => 'assignment', 'label' => 'Assignment'],
            ],
        ]);
    }
}
