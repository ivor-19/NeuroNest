<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\InstructorController;
use App\Http\Controllers\ContactController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/contactus', function () {
    return Inertia::render('contactus');
})->name('contactus');

Route::post('/contact', [ContactController::class, 'store'])->name('add.concern');

Route::middleware(['auth', 'verified'])->group(function () {
    // Student routes
    Route::middleware(['role:student'])->prefix('student')->group(function () {
        Route::get('/dashboard', [StudentController::class, 'dashboard'])->name('student.dashboard');
        Route::get('/subject/{subject_id}/modules', [StudentController::class, 'modules'])->name('student.modules');
        Route::get('/assessment', [StudentController::class, 'assessment'])->name('student.assessment');
        Route::get('/modules/{id}/download', [ModuleController::class, 'download'])
        ->name('student.moduleDownload');
        Route::get('/calendar', [StudentController::class, 'calendar'])->name('student.calendar');

        Route::post('/subject/module-complete', [ModuleController::class, 'moduleCompletion'])->name('student.moduleCompletion');
        Route::post('/assessment/submit-assessment', [AssessmentController::class, 'submitAssessment'])->name('student.submitAssessment');
    
    });
    
    // Instructor routes
    Route::middleware(['role:instructor'])->prefix('instructor')->group(function () {
        Route::get('/dashboard', [InstructorController::class, 'dashboard'])->name('instructor.dashboard');
         Route::get('/subjects/modules', [InstructorController::class, 'modules'])->name('instructor.modules');
        Route::get('/sections', [InstructorController::class, 'sections'])->name('instructor.sections');
        Route::get('/sections/subjects/modules', [InstructorController::class, 'modules'])->name('instructor.modules');
        Route::get('/sections/assessments', [InstructorController::class, 'assessments'])->name('instructor.assessments');
        Route::get('/modules/{id}/download', [ModuleController::class, 'download'])
        ->name('instructor.moduleDownload');
        Route::get('/calendar', [InstructorController::class, 'calendar'])->name('instructor.calendar');


        Route::get('/sections/{assessment}/questions', [AssessmentController::class, 'getQuestions'])->name('instructor.getQuestions');
        Route::get('/assessments/respondents', [AssessmentController::class, 'getRespondents'])->name('assessments.respondents');

        Route::post('/create-assessment', [AssessmentController::class, 'createAssessment'])->name('instructor.createAssessment');
        Route::post('/assessment-availability/{id}', [AssessmentController::class, 'assessmentAvailability'])->name('instructor.assessmentAvailability');
        Route::post('/assign-assessment', [AssessmentController::class, 'assignAssessment'])->name('instructor.assignAssessment');
        Route::post('/{assessment}/save-questions', [AssessmentController::class, 'saveQuestions'])->name('instructor.saveQuestions');

        Route::post('/module-availability/{id}', [ModuleController::class, 'moduleAvailability'])->name('instructor.moduleAvailability');

        Route::delete('/assessments/{assessment}', [AssessmentController::class, 'deleteAssessment'])->name('instructor.deleteAssessment');
        Route::delete('/assessment-assignments/{id}', [AssessmentController::class, 'removeAssignedAssessment'])->name('instructor.removeAssignedAssessment');
    });
    
    // Admin routes
    Route::middleware(['role:admin'])->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
        Route::get('/manage-users', [AdminController::class, 'manageUsers'])->name('admin.manageUsers');
        Route::get('/manage-students', [AdminController::class, 'manageStudents'])->name('admin.manageStudents');
        Route::get('/manage-courses', [AdminController::class, 'manageCourses'])->name('admin.manageCourses');
        Route::get('/manage-subjects', [AdminController::class, 'manageSubjects'])->name('admin.manageSubjects');
        Route::get('/manage-instructors', [AdminController::class, 'manageInstructors'])->name('admin.manageInstructors');
        Route::get('/calendar', [AdminController::class, 'calendar'])->name('admin.calendar');
        
        Route::get('/contactus', [ContactController::class, 'index'])->name('admin.contactus');
        // Add these lines in your admin middleware group
        Route::delete('/contacts/concern/{id}', [ContactController::class, 'deleteConcern'])->name('admin.deleteConcern');
        Route::delete('/contacts', [ContactController::class, 'destroyMultiple'])->name('admin.contacts.destroyMultiple');

        Route::post('/add-user', [AdminController::class, 'store'])->name('admin.addUser');
        Route::post('/add-course', [AdminController::class, 'addCourse'])->name('admin.addCourse');
        Route::post('/add-subject', [AdminController::class, 'addSubject'])->name('admin.addSubject');
        Route::post('/add-schedule', [AdminController::class, 'addSchedule'])->name('admin.addSchedule');
        Route::post('/add-module', [ModuleController::class, 'addModule'])->name('admin.addModule');

        Route::post('/assign-student', [AdminController::class, 'assignStudentToSection'])->name('admin.assignStudent');
        Route::post('/assign-subjects', [AdminController::class, 'assignSubjectsToCourse'])->name('admin.assignSubjects');
        Route::post('/assign-instructor', [AdminController::class, 'assignInstructor'])->name('admin.assignInstructor');

        Route::put('/updateUser/{id}', [AdminController::class, 'updateUser'])->name('admin.updateUser');
        Route::put('/updateCourse/{id}', [AdminController::class, 'updateCourse'])->name('admin.updateCourse');
        Route::post('/updateSubject/{id}', [AdminController::class, 'updateSubject'])->name('admin.updateSubject'); 
        Route::post('/subject-availability/{id}', [AdminController::class, 'subjectAvailability'])->name('admin.subjectAvailability');
       
        Route::delete('/delete-user/{id}', [AdminController::class, 'deleteUser'])->name('admin.deleteUser');
        Route::delete('/delete-course/{id}', [AdminController::class, 'deleteCourse'])->name('admin.deleteCourse');
        Route::delete('/remove-subject/{id}', [AdminController::class, 'removeSubjectFromACourse'])->name('admin.removeSubject');
        Route::delete('/delete-subject/{id}', [AdminController::class, 'deleteSubject'])->name('admin.deleteSubject');
        Route::delete('/remove-from-section/{id}', [AdminController::class, 'removeFromSection'])->name('admin.removeFromSection');
        Route::delete('/unassigned-instructor/{id}', [AdminController::class, 'unassignedInstructor'])->name('admin.unassignedInstructor');
        Route::delete('/delete-schedule/{id}', [AdminController::class, 'deleteSchedule'])->name('admin.deleteSchedule');
        
        Route::delete('/delete-module/{id}', [ModuleController::class, 'deleteModule'])->name('admin.deleteModule');
        
        Route::post('/add-activity', [ActivityController::class, 'addActivity'])->name('admin.addActivity');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';