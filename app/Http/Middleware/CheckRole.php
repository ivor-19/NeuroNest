<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    public function handle(Request $request, Closure $next, string $role)
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();
        
        // If user doesn't have the required role
        if ($user->role !== $role) {
            // Redirect to their appropriate dashboard based on their role
            return match($user->role ?? 'student') {
                'admin' => redirect('/admin/dashboard'),
                'instructor' => redirect('/instructor/dashboard'),
                'student' => redirect('/student/dashboard'),
                default => redirect('/student/dashboard')
            };
        }

        return $next($request);
    }
}