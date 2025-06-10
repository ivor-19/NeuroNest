<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    
    // Student routes - protected by role:student middleware
    Route::middleware(['role:student'])->prefix('student')->group(function () {
        Route::get('/dashboard', [StudentController::class, 'dashboard'])->name('student.dashboard');
        Route::get('/subject/{subject_id}/modules', [StudentController::class, 'modules'])->name('student.modules');
        // Add more student routes here
    });
    
    // Teacher routes - protected by role:teacher middleware
    Route::middleware(['role:teacher'])->prefix('teacher')->group(function () {
        Route::get('/dashboard', [TeacherController::class, 'dashboard'])->name('teacher.dashboard');
        // Add more teacher routes here
    });
    
    // Admin routes - protected by role:admin middleware
    Route::middleware(['role:admin'])->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
        Route::get('/manageUsers', [AdminController::class, 'manageUsers'])->name('admin.manageUsers');
        Route::post('/addUser', [AdminController::class, 'store'])->name('admin.addUser');
        Route::get('/manageStudents', [AdminController::class, 'manageStudents'])->name('admin.manageStudents');
        // Add more admin routes here
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
