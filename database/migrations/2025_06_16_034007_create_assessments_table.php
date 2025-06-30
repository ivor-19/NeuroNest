<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('instructor_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
     
        });

        Schema::create('assessment_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assessment_id')->constrained('assessments')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->string('year_level'); 
            $table->string('section'); 
            $table->boolean('is_available')->default(false);
            $table->dateTime('opened_at')->nullable();  // When to make available
            $table->dateTime('closed_at')->nullable();      // Deadline
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
            
            // Ensure one response per SECTION per assessment
            $table->unique(
                ['assessment_id', 'course_id', 'year_level', 'section'],
                'assessments_unique_combo' // Custom shorter name
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessments');
        Schema::dropIfExists('assessment_assignments');
    }
};
