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
        Schema::create('modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subject_id')->constrained('subjects')->onDelete('cascade');
            $table->foreignId('creator_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->enum('status', ['published', 'draft'])->default('draft');
            $table->integer('order'); 
            $table->json('materials')->nullable(); // Store multiple materials in a flexible format
            $table->string('pdf')->nullable(); // Optional standalone PDF
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp(column: 'updated_at')->useCurrent();

            // Add unique constraint on subject_id and order combination. Means each subject can only have one module with order 1 and so on...
            $table->unique(['subject_id', 'order'], 'unique_subject_module_order');
        });

        Schema::create('module_access', function (Blueprint $table) {
            $table->id();
            $table->foreignId('module_id')->constrained('modules')->onDelete('cascade');
            $table->foreignId('class_instructor_id')->constrained('class_instructors')->onDelete('cascade');
            $table->boolean('is_available')->default(true);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp(column: 'updated_at')->useCurrent();
            
            // Prevent duplicate entries
            $table->unique(['module_id', 'class_instructor_id']);
        });

        Schema::create('module_completions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('module_id')->constrained('modules')->onDelete('cascade');
            $table->boolean('is_done')->default(false); // Simple boolean flag
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp(column: 'updated_at')->useCurrent();
            
            // Prevent duplicate entries
            $table->unique(['student_id', 'module_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            $table->dropForeign(['subject_id']);
            $table->dropForeign(['creator_id']);
        });
    
        Schema::dropIfExists('modules');
        Schema::dropIfExists('module_access');
        Schema::dropIfExists('module_completions');
    }
};
