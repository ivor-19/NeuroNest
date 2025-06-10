<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Subject;
use App\Models\User;
use Hash;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rules;

class AdminController extends Controller
{
    public function dashboard(){
    
        $authUser = auth()->user();
        $allUsers = User::all(['id', 'name', 'email', 'role']);
        $subjectsCount = Subject::where('isActive', 1)->count();
        $coursesCount = Course::where('isActive', 1)->count();

        // Count users by role
        $roleCounts = [
            'student' => User::where('role', 'student')->count(),
            'teacher' => User::where('role', 'teacher')->count(),
            'admin' => User::where('role', 'admin')->count(),
        ];
        
        return Inertia::render('Admin/Dashboard', [
            'authUser' => $authUser,
            'users' => $allUsers,
            'roleCounts' => $roleCounts,
            'subjectsCount' => $subjectsCount,
            'coursesCount' => $coursesCount
        ]);
    }

    //FOR USERS
    public function manageUsers() {
        return Inertia::render('Admin/ManageUsers', []);
    }

    public function store(Request $request){
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'role' => 'required|string|in:student,teacher,admin',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));
        
        return redirect()->route('admin.manageUsers')->with('success', 'User added successfully!');
    }

    // FOR STUDENTS
    public function manageStudents() {
        return Inertia::render('Admin/ManageStudents', []);
    }
}