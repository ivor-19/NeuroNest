<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\InstructorController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/contactus', function () {
    return Inertia::render('contactus');
})->name('contactus');

Route::middleware(['auth', 'verified'])->group(function () {
    
    // Student routes - protected by role:student middleware
    Route::middleware(['role:student'])->prefix('student')->group(function () {
        Route::get('/dashboard', [StudentController::class, 'dashboard'])->name('student.dashboard');
        Route::get('/subject/{subject_id}/modules', [StudentController::class, 'modules'])->name('student.modules');
        // Add more student routes here
    });
    
    // instructor routes - protected by role:instructor middleware
    Route::middleware(['role:instructor'])->prefix('instructor')->group(function () {
        Route::get('/dashboard', [InstructorController::class, 'dashboard'])->name('instructor.dashboard');
        // Add more instructor routes here
    });
    
    // Admin routes - protected by role:admin middleware
    Route::middleware(['role:admin'])->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
        Route::get('/manage-users', [AdminController::class, 'manageUsers'])->name('admin.manageUsers');
        Route::get('/manage-students', [AdminController::class, 'manageStudents'])->name('admin.manageStudents');
        Route::get('/manage-courses', [AdminController::class, 'manageCourses'])->name('admin.manageCourses');
        Route::get('/manage-subjects', [AdminController::class, 'manageSubjects'])->name('admin.manageSubjects');
        Route::get('/manage-instructors', [AdminController::class, 'manageInstructors'])->name('admin.manageInstructors');

        Route::post('/add-user', [AdminController::class, 'store'])->name('admin.addUser');
        Route::post('/add-course', [AdminController::class, 'addCourse'])->name('admin.addCourse');
        Route::post('/add-subject', [AdminController::class, 'addSubject'])->name('admin.addSubject');
        Route::post('/add-module', [AdminController::class, 'addModule'])->name('admin.addModule');

        Route::post('/assign-student', [AdminController::class, 'assignStudentToSection'])->name('admin.assignStudent');
        Route::post('/assign-subjects', [AdminController::class, 'assignSubjectsToCourse'])->name('admin.assignSubjects');
        Route::post('/assign-instructor', [AdminController::class, 'assignInstructor'])->name('admin.assignInstructor');

        Route::delete('/delete-course/{id}', [AdminController::class, 'deleteCourse'])->name('admin.deleteCourse');
        Route::delete('/remove-subject/{id}', [AdminController::class, 'removeSubjectFromACourse'])->name('admin.removeSubject');
        Route::delete('/delete-subject/{id}', [AdminController::class, 'deleteSubject'])->name('admin.deleteSubject');
        Route::delete('/delete-module/{id}', [AdminController::class, 'deleteModule'])->name('admin.deleteModule');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
