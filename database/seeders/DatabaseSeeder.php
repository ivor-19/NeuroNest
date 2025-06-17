<?php

namespace Database\Seeders;

use App\Models\Subject;
use App\Models\User;
use App\Models\Course;
use App\Models\StudentProfile;
use App\Models\ClassInstructor;
use App\Models\Module;
use App\Models\ModuleAccess;
use Hash;
use Illuminate\Database\Seeder;
use DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Clear existing data to avoid conflicts
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        ModuleAccess::truncate();
        Module::truncate();
        ClassInstructor::truncate();
        StudentProfile::truncate();
        DB::table('course_subjects')->truncate();
        Subject::truncate();
        Course::truncate();
        User::where('email', '!=', 'admin@example.com')->delete(); // Keep admin if exists
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        // Create Users
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'account_id' => 'ADMIN123',
            'password' => Hash::make('12345678'),
            'role' => 'admin'
        ]);

        $instructor = User::create([
            'name' => 'John Instructor',
            'email' => 'instructor@example.com',
            'account_id' => 'IN12345678',
            'password' => Hash::make('12345678'),
            'role' => 'instructor'
        ]);

        $student = User::create([
            'name' => 'Student User',
            'email' => 'student@example.com',
            'account_id' => 'MA21011504',
            'password' => Hash::make('12345678'),
            'role' => 'student'
        ]);

        // Create 3 Courses
        $courses = [
            Course::create([
                'code' => 'CS',
                'name' => 'Computer Science',
                'description' => 'Computer Science Program',
                'isActive' => true
            ]),
            Course::create([
                'code' => 'IT',
                'name' => 'Information Technology',
                'description' => 'Information Technology Program',
                'isActive' => true
            ]),
            Course::create([
                'code' => 'MATH',
                'name' => 'Mathematics',
                'description' => 'Mathematics Program',
                'isActive' => true
            ])
        ];

        // Create 3 Subjects per Course (9 subjects total)
        $subjectsData = [
            // CS Subjects
            ['code' => 'CS101', 'title' => 'Introduction to Programming', 'description' => 'Basic programming concepts', 'year_level' => '1', 'semester' => '1st'],
            ['code' => 'CS102', 'title' => 'Data Structures', 'description' => 'Data structures and algorithms', 'year_level' => '1', 'semester' => '2nd'],
            ['code' => 'CS201', 'title' => 'Database Systems', 'description' => 'Database design and management', 'year_level' => '2', 'semester' => '1st'],
            
            // IT Subjects
            ['code' => 'IT101', 'title' => 'Network Fundamentals', 'description' => 'Basic networking concepts', 'year_level' => '1', 'semester' => '1st'],
            ['code' => 'IT102', 'title' => 'System Administration', 'description' => 'Server and system management', 'year_level' => '1', 'semester' => '2nd'],
            ['code' => 'IT201', 'title' => 'Cybersecurity', 'description' => 'Information security principles', 'year_level' => '2', 'semester' => '1st'],
            
            // Math Subjects
            ['code' => 'MATH101', 'title' => 'Calculus I', 'description' => 'Differential calculus', 'year_level' => '1', 'semester' => '1st'],
            ['code' => 'MATH102', 'title' => 'Calculus II', 'description' => 'Integral calculus', 'year_level' => '1', 'semester' => '2nd'],
            ['code' => 'MATH201', 'title' => 'Linear Algebra', 'description' => 'Vectors and matrices', 'year_level' => '2', 'semester' => '1st']
        ];

        $subjects = [];
        foreach ($subjectsData as $subjectData) {
            $subjects[] = Subject::create($subjectData);
        }

        // Link subjects to courses (3 subjects per course)
        for ($i = 0; $i < 3; $i++) {
            // CS subjects (0,1,2)
            DB::table('course_subjects')->insert([
                'course_id' => $courses[0]->id,
                'subject_id' => $subjects[$i]->id,
                'created_at' => now(),
                'updated_at' => now()
            ]);
            
            // IT subjects (3,4,5)
            DB::table('course_subjects')->insert([
                'course_id' => $courses[1]->id,
                'subject_id' => $subjects[$i + 3]->id,
                'created_at' => now(),
                'updated_at' => now()
            ]);
            
            // Math subjects (6,7,8)
            DB::table('course_subjects')->insert([
                'course_id' => $courses[2]->id,
                'subject_id' => $subjects[$i + 6]->id,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        // Create Student Profile
        StudentProfile::create([
            'student_id' => $student->id,
            'course_id' => $courses[0]->id, // CS course
            'year_level' => 1,
            'section' => 'A',
            'academic_year' => 2024
        ]);

        // Create Class Instructors for each subject
        $classInstructors = [];
        foreach ($subjects as $index => $subject) {
            $courseIndex = intval($index / 3); // 0,1,2 for each group of 3 subjects
            $classInstructors[] = ClassInstructor::create([
                'instructor_id' => $instructor->id,
                'course_id' => $courses[$courseIndex]->id,
                'year_level' => $subject->year_level,
                'section' => 'A',
                'subject_id' => $subject->id
            ]);
        }

        // Create 3 Modules per Subject (27 modules total)
        $moduleCount = 1;
        foreach ($subjects as $subjectIndex => $subject) {
            for ($i = 1; $i <= 3; $i++) {
                Module::create([
                    'subject_id' => $subject->id,
                    'creator_id' => $instructor->id,
                    'title' => $subject->title . ' - Module ' . $i,
                    'description' => 'Module ' . $i . ' for ' . $subject->title,
                    'status' => 'published',
                    'order' => $i,
                    'materials' => json_encode([
                        ['type' => 'video', 'title' => 'Video Lecture ' . $i],
                        ['type' => 'document', 'title' => 'Reading Material ' . $i]
                    ]),
                    'pdf' => 'module_' . $moduleCount . '.pdf'
                ]);
                $moduleCount++;
            }
        }
    }
}