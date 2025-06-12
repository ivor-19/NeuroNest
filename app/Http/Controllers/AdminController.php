<?php

namespace App\Http\Controllers;

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
            'teacher' => User::where('role', 'teacher')->count(),
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

    //FOR USERS
    public function manageUsers() {
        return Inertia::render('Admin/ManageUsers', []);
    }

    public function store(Request $request){
        $request->validate([
            'name' => 'required|string|max:255',
            'account_id' => 'required|string|max:255',
            'email' => 'string|lowercase|email|max:255|unique:'.User::class,
            'role' => 'required|string|in:student,teacher,admin',
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

    // FOR STUDENTS
    public function manageStudents() {
        $allUserStudent = User::where('role', 'student'::class)->get();
        
        $allStudents = StudentProfile::with(['student', 'course'])->get();
        $studentWithTheirCourses = $allStudents->map(function($student) {
            return [
                'id' => $student->id,
                'student_id' => $student->student->account_id,
                'student_name' => $student->student->name,
                'student_email' => $student->student->email,
                'course_id' => $student->course_id,
                'course_code' => $student->course->code, 
                'year_level' => $student->year_level,
                'section' => $student->section,
                'academic_year' => $student->academic_year,
            ];
        });

        $allCourses = Course::all();
        
        return Inertia::render('Admin/ManageStudents', [
            'users' => $allUserStudent,
            'students' => $studentWithTheirCourses,
            'courses' => $allCourses
        ]);
    }

    public function assignStudentToSection(Request $request) {
        $request->validate([
            'student_id' => 'required|integer|exists:users,id',
            'course_id' => 'required|integer|exists:courses,id',
            'year_level' => 'required|integer',
            'section' => 'required|string|max:255',
            'academic_year' => 'required|string|max:255',
          
           ]);
    
        StudentProfile::create($request->all());
        return redirect()->back()->with('success',`Successfully assigned a student to a section`);
    }

    // FOR COuRSEs
    public function manageCourses() {
        // Get all courses
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
            'code' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
          
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

    //FOR SUBJECTS
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
            'code' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:255',
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

    public function addModule(Request $request){
        $request->validate([
            'subject_id' => 'required|integer|exists:subjects,id',
            'creator_id' => 'required|integer|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'status' => 'required|string',
            'order' => 'required|integer',

          
           ]);
    
        Module::create($request->all());
        return redirect()->back()->with('success',`Successfully added a module`);
    }

    public function deleteModule($id){
        $module = Module::findOrFail($id);  
        $module->delete();

        return redirect()->back()->with('success','Deleted a module');
    }
}