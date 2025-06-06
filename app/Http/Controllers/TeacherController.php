<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function dashboard(){
        return Inertia::render('Teacher/Dashboard', ['user'=>auth()->user()]);
    }
}
