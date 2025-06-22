<?php

namespace App\Http\Controllers;

use App\Models\ClassInstructor;
use App\Models\Course;
use App\Models\CourseSubject;
use App\Models\Module;
use App\Models\StudentProfile;
use App\Models\StudentProfiles;
use App\Models\Subject;
use App\Models\User;
use Hash;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rules;

class AdminController extends Controller
{
    public function dashboard(){
    
        $authUser = auth()->user();
        $allUsers = User::all(['id', 'name', 'email', 'role']);
        $subjectsCount = Subject::where('isActive', 1)->count();
        $coursesCount = Course::where('isActive', 1)->count();

        // Count users by role
        $roleCounts = [
            'student' => User::where('role', 'student')->count(),
            'instructor' => User::where('role', 'instructor')->count(),
            'admin' => User::where('role', 'admin')->count(),
        ];
        
        return Inertia::render('Admin/Dashboard', [
            'authUser' => $authUser,
            'users' => $allUsers,
            'roleCounts' => $roleCounts,
            'subjectsCount' => $subjectsCount,
            'coursesCount' => $coursesCount
        ]);
    }

//************************************************FOR USERS**************************************************
    public function manageUsers() {

        $allUsers = User::all();
        return Inertia::render('Admin/ManageUsers', [
            'users' => $allUsers,
        ]);
    }

    public function store(Request $request){
        $request->validate([
            'name' => 'required|string|max:255',
            'account_id' => 'required|string|max:255',
            'email' => 'string|lowercase|email|max:255|unique:'.User::class,
            'role' => 'required|string|in:student,instructor,admin',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'account_id' => $request->account_id,
            'email' => $request->email,
            'role' => $request->role,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));
        
        return redirect()->route('admin.manageUsers')->with('success', 'User added successfully!');
    }



//******************************************FOR STUDENTS*************************************************
    public function manageStudents() {
        $allUserStudent = User::where('role', 'student'::class)->get();
        
        $students = User::where('role', 'student')
        ->with(['studentSection.course']) // using the correct relationship name
        ->get()
        ->map(function ($user) {
            $studentProfile = $user->studentSection; // using the correct relationship name
            
            return [
                'user_id' => $user->id,
                'student_id' => $user->account_id,
                'student_name' => $user->name,
                'student_email' => $user->email,
                'contact_number' => $user->contact_number,
                'student_status' => $user->status,
                'student_remarks' => $user->remarks,
                'profile_id' => $studentProfile ? $studentProfile->id : null,
                'course_id' => $studentProfile ? $studentProfile->course_id : null,
                'course_code' => $studentProfile && $studentProfile->course ? $studentProfile->course->code : null,
                'year_level' => $studentProfile ? $studentProfile->year_level : null,
                'section' => $studentProfile ? $studentProfile->section : null,
                'academic_year' => $studentProfile ? $studentProfile->academic_year : null,
            ];
        });

        $allCourses = Course::all();
        
        return Inertia::render('Admin/ManageStudents', [
            'users' => $allUserStudent,
            'students' => $students,
            'courses' => $allCourses
        ]);
    }

    public function assignStudentToSection(Request $request) {
        $request->validate([
            'student_id' => 'required|integer|exists:users,id|unique:student_profiles,student_id',
            'course_id' => 'required|integer|exists:courses,id',
            'year_level' => 'required|integer',
            'section' => 'required|string|max:255',
            'academic_year' => 'required|string|max:255',
          
           ]);
    
        StudentProfile::create($request->all());
        return redirect()->back()->with('success',`Successfully assigned a student to a section`);
    }




 //********************************************************FOR COURSES****************************************************
    public function manageCourses() {
        $courses = Course::all();
        
        // Get course-subject relationships with related data
        $courseSubjects = CourseSubject::with(['course', 'subject' => function($query) {
            $query->orderBy('year_level', 'asc')
                  ->orderBy('semester', 'asc');
        }])->get();
        
        // Group by course and include pivot ID
        $coursesWithSubjects = $courses->map(function($course) use ($courseSubjects) {
            $subjects = $courseSubjects->where('course_id', $course->id)->map(function($courseSubject) {
                return [
                    'pivotId' => $courseSubject->id, // This is the course_subjects table ID
                    'id' => $courseSubject->subject->id,
                    'code' => $courseSubject->subject->code,
                    'title' => $courseSubject->subject->title,
                    'yearLevel' => $courseSubject->subject->year_level,
                    'semester' => $courseSubject->subject->semester,
                ];
            })->values(); // Reset array keys
            
            return [
                'id' => $course->id,
                'name' => $course->name,
                'code' => $course->code,
                'description' => $course->description,
                'isActive' => $course->isActive,
                'subjects' => $subjects
            ];
        });
        
        // Get all subjects for assignment
        $allSubjects = Subject::orderBy('year_level', 'asc')
            ->orderBy('semester', 'asc')
            ->get()
            ->map(function($subject) {
                return [
                    'id' => $subject->id,
                    'code' => $subject->code,
                    'title' => $subject->title,
                    'yearLevel' => $subject->year_level,
                    'semester' => $subject->semester,
                ];
            });
    
        return Inertia::render('Admin/ManageCourses', [
            'courses' => $coursesWithSubjects,
            'allSubjects' => $allSubjects
        ]);
    }

    public function addCourse(Request $request) {
        $request->validate([
            'code' => 'required|string|max:255|unique:courses,code',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
          
           ]);
    
        Course::create($request->all());
        return redirect()->back()->with('success',`Successfully added a course`);
    }

    public function deleteCourse($id)
    {
        $course = Course::findOrFail($id);
        $course->delete();

        return redirect()->back()->with('success',`Deleted a course`);
    }

    public function assignSubjectsToCourse(Request $request) {
        $request->validate([
            'course_id' => 'required|integer|exists:courses,id',
            'toAdd' => 'required|array',
            'toAdd.*' => 'integer|exists:subjects,id',
        ]);
    
        $course = Course::findOrFail($request->course_id);
        
        // Only attach new subjects (don't detach any for now)
        $course->subjects()->syncWithoutDetaching($request->toAdd);
    
        return redirect()->back()->with('success',`Successfully assign a subject to a course`);
    }

    public function removeSubjectFromACourse($id)
    {
        $subject = CourseSubject::findOrFail($id);
        $subject->delete();

        return redirect()->back()->with('success',`Remove a subject from a course`);
    }



//*********************************************FOR SUBJECTS************************************************
    public function manageSubjects() {
        $allSubjects = Subject::with(['modules'])->get();

        $subjectsWithModules = $allSubjects->map(function($subject) {
            return [
                'id' => $subject->id,
                'code' => $subject->code,
                'title' => $subject->title,
                'year_level' => $subject->year_level,
                'semester' => $subject->semester,
                'description' => $subject->description,
                'isActive' => $subject->isActive,
                'modules' => $subject->modules->map(function($module) {
                    return [
                        'id' => $module->id,
                        'subject_id' => $module->subject_id,
                        'title' => $module->title,
                        'description' => $module->description,
                        'status' => $module->status,
                        'order' => $module->order,
                        'materials' => $module->materials,
                        'pdf' => $module->pdf,
                    ];
                })
            ];
        });

        return Inertia::render('Admin/ManageSubjects', [
            'subjects' => $subjectsWithModules,
        ]);
    }

    public function addSubject(Request $request){
        $request->validate([
            'code' => 'required|string|max:255|unique:subjects,code',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'year_level' => 'required|string',
            'semester' => 'required|string|max:255',
            'isActive' => 'required|string',

          
           ]);
    
        Subject::create($request->all());
        return redirect()->back()->with('success',`Successfully added a subject`);
    }

    public function deleteSubject($id){
        $subject = Subject::findOrFail($id);  
        $subject->delete();

        return redirect()->back()->with('success','Deleted a subject');
    }

//*******************************************FOR INSTRUCTORS*****************************************************
    public function manageInstructors() {
        $allInstructorUser = User::where('role', 'instructor')
            ->with(['classInstructor.course', 'classInstructor.subject'])
            ->get();
    
        $instructorsWithAssignments = $allInstructorUser->map(function ($instructor) {
            return [
                'id' => $instructor->id,
                'name' => $instructor->name,
                'email' => $instructor->email,
                'account_id' => $instructor->account_id,
                'contact_number' => $instructor->contact_number,
                'remarks' => $instructor->remarks,
                'status' => $instructor->status,
                'teaching_assignments' => $instructor->classInstructor->map(function ($assignment) {
                    return [
                        'id' => $assignment->id,
                        'course_code' => $assignment->course->code ?? 'N/A',
                        'course_name' => $assignment->course->name ?? 'N/A',
                        'subject_code' => $assignment->subject->code ?? 'N/A',
                        'subject_title' => $assignment->subject->title ?? 'N/A',
                        'subject_semester' => $assignment->subject->semester ?? 'N/A',
                        'year_level' => $assignment->year_level,
                        'section' => $assignment->section,
                    ];
                })
            ];
        });
    
        // Get course-subject relationships for filtering
        $courseSubjects = CourseSubject::with(['course', 'subject'])->get();
        
        $courseSubjectsGrouped = $courseSubjects->groupBy('course_id')->map(function ($subjects, $courseId) use ($courseSubjects) {
            $course = $courseSubjects->firstWhere('course_id', $courseId)->course;
            
            return [
                'course_id' => $courseId,
                'course_code' => $course->code,
                'course_name' => $course->name,
                'subjects' => $subjects->map(function ($courseSubject) {
                    return [
                        'id' => $courseSubject->subject->id,
                        'code' => $courseSubject->subject->code,
                        'title' => $courseSubject->subject->title,
                    ];
                })
            ];
        });
                
        return Inertia::render('Admin/ManageInstructors', [
            'instructors' => $instructorsWithAssignments,
            'courseSubjects' => $courseSubjectsGrouped,
        ]);
    }

    public function assignInstructor(Request $request)
    {
        $request->validate([
            'instructor_id' => 'required|exists:users,id',
            'course_id' => 'required|exists:courses,id',
            'subject_id' => 'required|exists:subjects,id',
            'year_level' => 'required|string',
            'section' => 'required|string',
        ]);
    
        $existingAssignment = ClassInstructor::where([
            'course_id' => $request->course_id,
            'year_level' => $request->year_level,
            'section' => $request->section,
            'subject_id' => $request->subject_id,
        ])->exists();
    
        if ($existingAssignment) {
            return back()->withErrors([
                'message' => 'There is already an instructor assigned for this section with the same course, year level, and subject.'
            ]);
        }
    
        ClassInstructor::create($request->all());
        return back()->with('success', 'Successfully assigned');
    }

}