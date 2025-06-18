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
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assessment_id')->constrained('assessments')->cascadeOnDelete();
            $table->enum('type', ['multiple-choice', 'true-false', 'short-answer', 'essay']);
            $table->text('question'); // matches your frontend field name
            $table->integer('points')->default(1);
            $table->json('options')->nullable(); // Store options as JSON array for multiple-choice
            $table->string('correct_answer')->nullable(); // Store as string to match frontend (index for MC, "0"/"1" for T/F)
            $table->integer('order')->default(0); // For question ordering in assessment
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp(column: 'updated_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
