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

        // Create 4 Engineering Courses
        $courses = [
            Course::create([
                'code' => 'BSCE',
                'name' => 'Civil Engineering',
                'description' => 'Bachelor of Science in Civil Engineering',
                'isActive' => true
            ]),
            Course::create([
                'code' => 'BSME',
                'name' => 'Mechanical Engineering',
                'description' => 'Bachelor of Science in Mechanical Engineering',
                'isActive' => true
            ]),
            Course::create([
                'code' => 'BSCPE',
                'name' => 'Computer Engineering',
                'description' => 'Bachelor of Science in Computer Engineering',
                'isActive' => true
            ]),
            Course::create([
                'code' => 'BSEE',
                'name' => 'Electrical Engineering',
                'description' => 'Bachelor of Science in Electrical Engineering',
                'isActive' => true
            ])
        ];

        // Create 3 Subjects per Course (12 subjects total)
        $subjectsData = [
            // Civil Engineering Subjects
            ['code' => 'CE101', 'title' => 'Statics of Rigid Bodies', 'description' => 'Principles of static equilibrium', 'year_level' => '1', 'semester' => '1st'],
            ['code' => 'CE102', 'title' => 'Mechanics of Deformable Bodies', 'description' => 'Stress and strain analysis', 'year_level' => '1', 'semester' => '2nd'],
            ['code' => 'CE201', 'title' => 'Structural Theory', 'description' => 'Analysis of structural systems', 'year_level' => '2', 'semester' => '1st'],
            
            // Mechanical Engineering Subjects
            ['code' => 'ME101', 'title' => 'Thermodynamics', 'description' => 'Principles of heat and energy', 'year_level' => '1', 'semester' => '1st'],
            ['code' => 'ME102', 'title' => 'Fluid Mechanics', 'description' => 'Behavior of fluids at rest and in motion', 'year_level' => '1', 'semester' => '2nd'],
            ['code' => 'ME201', 'title' => 'Machine Design', 'description' => 'Design of mechanical components', 'year_level' => '2', 'semester' => '1st'],
            
            // Computer Engineering Subjects
            ['code' => 'CPE101', 'title' => 'Logic Circuits and Design', 'description' => 'Digital logic fundamentals', 'year_level' => '1', 'semester' => '1st'],
            ['code' => 'CPE102', 'title' => 'Computer Organization', 'description' => 'Computer architecture basics', 'year_level' => '1', 'semester' => '2nd'],
            ['code' => 'CPE201', 'title' => 'Microprocessor Systems', 'description' => 'Microprocessor architecture and programming', 'year_level' => '2', 'semester' => '1st'],
            
            // Electrical Engineering Subjects
            ['code' => 'EE101', 'title' => 'Circuit Theory', 'description' => 'Analysis of electrical circuits', 'year_level' => '1', 'semester' => '1st'],
            ['code' => 'EE102', 'title' => 'Electromagnetic Fields', 'description' => 'Electric and magnetic fields theory', 'year_level' => '1', 'semester' => '2nd'],
            ['code' => 'EE201', 'title' => 'Power Systems', 'description' => 'Generation, transmission and distribution of electrical power', 'year_level' => '2', 'semester' => '1st']
        ];

        $subjects = [];
        foreach ($subjectsData as $subjectData) {
            $subjects[] = Subject::create($subjectData);
        }

        // Link subjects to courses (3 subjects per course)
        for ($i = 0; $i < 3; $i++) {
            // BSCE subjects (0,1,2)
            DB::table('course_subjects')->insert([
                'course_id' => $courses[0]->id,
                'subject_id' => $subjects[$i]->id,
                'created_at' => now(),
                'updated_at' => now()
            ]);
            
            // BSME subjects (3,4,5)
            DB::table('course_subjects')->insert([
                'course_id' => $courses[1]->id,
                'subject_id' => $subjects[$i + 3]->id,
                'created_at' => now(),
                'updated_at' => now()
            ]);
            
            // BSCPE subjects (6,7,8)
            DB::table('course_subjects')->insert([
                'course_id' => $courses[2]->id,
                'subject_id' => $subjects[$i + 6]->id,
                'created_at' => now(),
                'updated_at' => now()
            ]);
            
            // BSEE subjects (9,10,11)
            DB::table('course_subjects')->insert([
                'course_id' => $courses[3]->id,
                'subject_id' => $subjects[$i + 9]->id,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        // Create Student Profile (enrolled in Computer Engineering)
        StudentProfile::create([
            'student_id' => $student->id,
            'course_id' => $courses[2]->id, // BSCPE course
            'year_level' => 1,
            'section' => 'A',
            'academic_year' => 2024
        ]);

        // Create Class Instructors for each subject
        $classInstructors = [];
        foreach ($subjects as $index => $subject) {
            $courseIndex = intval($index / 3); // 0,1,2,3 for each group of 3 subjects
            $classInstructors[] = ClassInstructor::create([
                'instructor_id' => $instructor->id,
                'course_id' => $courses[$courseIndex]->id,
                'year_level' => $subject->year_level,
                'section' => 'A',
                'subject_id' => $subject->id
            ]);
        }

        // Create 3 Modules per Subject (36 modules total)
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
                        ['type' => 'document', 'title' => 'Reading Material ' . $i],
                        ['type' => 'quiz', 'title' => 'Assessment ' . $i]
                    ]),
                    'pdf' => 'module_' . $moduleCount . '.pdf'
                ]);
                $moduleCount++;
            }
        }
    }
}