<?php

namespace App\Http\Controllers;

use App\Models\StudentSubjects;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function dashboard()
    {
        $user = auth()->user();
        
        // Load user with subjects relationship
        $user->load('studentSubjects');
        
        return Inertia::render('Student/Dashboard', [
            'user' => $user,
            'subjects' => $user->studentSubjects,
        ]);
    }

    public function modules()
    {
        return Inertia::render('Student/Modules', [
            'user' => auth()->user(),
        ]);
    }
}