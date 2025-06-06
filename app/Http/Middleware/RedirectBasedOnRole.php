<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectBasedOnRole
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check()) {
            $user = Auth::user();
            
            // Define role-based routes
            $roleRoutes = [
                'student' => '/student/dashboard',
                'teacher' => '/teacher/dashboard', 
                'admin' => '/admin/dashboard'
            ];
            
            // Get the intended route for user's role
            $intendedRoute = $roleRoutes[$user->role] ?? '/dashboard';
            
            // If user is trying to access login/register and already authenticated
            if (in_array($request->route()->getName(), ['login', 'register'])) {
                return redirect($intendedRoute);
            }
            
            // Check if user is accessing wrong dashboard
            $currentPath = $request->path();
            if (str_contains($currentPath, '/dashboard') && $currentPath !== ltrim($intendedRoute, '/')) {
                return redirect($intendedRoute);
            }
        }
        
        return $next($request);
    }
}