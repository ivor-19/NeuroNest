<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function dashboard()
    {
        $user = auth()->user();
        
        return Inertia::render('Student/Dashboard', [
            'user' => $user,
            'subjects' => $user->subjects, // This will automatically use your getSubjectsAttribute()
        ]);
    }

    public function modules($subject_id)
    {
        $user = auth()->user();
        
       // Find subject and load its modules
        $subject = Subject::with('modules')->findOrFail($subject_id);

        return Inertia::render('Student/Modules', [
            'subject' => $subject,
            'modules' => $subject->modules,
        ]);
    }
}