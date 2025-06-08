<?php

namespace App\Http\Controllers;

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

    public function modules()
    {
        $user = auth()->user();
        
        // If you want subjects with their modules for the modules page
        $subjects = $user->subjects->load('modules');
        
        return Inertia::render('Student/Modules', [
            'user' => $user,
            'subjects' => $subjects,
        ]);
    }
}