<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('code'); // e.g., "CS", "IT"
            $table->string('name'); // Computer Science
            $table->text('description')->nullable(); 
            $table->boolean('isActive')->default(true);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
        });

        Schema::create('course_subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->foreignId('subject_id')->constrained('subjects')->onDelete('cascade');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
            
            // Prevent duplicate subject assignments
            $table->unique(['course_id', 'subject_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('courses');
        Schema::dropIfExists('course_subjects');
    }
};