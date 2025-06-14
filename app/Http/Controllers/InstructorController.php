<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class InstructorController extends Controller
{
    public function dashboard(){
        return Inertia::render('Instructor/Dashboard', ['user'=>auth()->user()]);
    }
}
