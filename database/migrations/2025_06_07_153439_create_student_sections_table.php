<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('student_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->integer('year_level'); // 1, 2, 3, 4
            $table->string('section', 1); // A, B, C, D, etc.
            $table->year('academic_year'); // 2024, 2025, etc.
            $table->timestamps();
            
            // Prevent duplicate enrollments
            $table->unique(
                ['student_id', 'course_id', 'year_level', 'academic_year'],
                'student_course_year_unique'
            );
        });
    }

    public function down()
    {
        Schema::dropIfExists('student_sections');
    }
};