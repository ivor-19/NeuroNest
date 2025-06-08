<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "CS-1A", "IT-2B"
            $table->integer('year_level'); // 1, 2, 3, 4
            $table->string('semester')->default('1st'); // 1st, 2nd
            $table->string('school_year'); // e.g., "2024-2025"
            $table->boolean('isActive')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('sections');
    }
};