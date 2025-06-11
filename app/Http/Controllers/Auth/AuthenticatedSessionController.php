<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(Request $request)
    {
        $request->validate([
            'account_id' => 'required|string',
            'password' => 'required|string',
        ]);

        if (Auth::attempt($request->only('account_id', 'password'), $request->boolean('remember'))) {
            $request->session()->regenerate();
            
            // Redirect based on user role
            $user = Auth::user();
            
            // Handle users without role (fallback to default dashboard)
            $role = $user->role ?? 'student'; // Default to student if no role
            
            return match($role) {
                'admin' => redirect()->intended('/admin/dashboard'),
                'teacher' => redirect()->intended('/teacher/dashboard'),
                'student' => redirect()->intended('/student/dashboard'),
                default => redirect()->intended('/dashboard')
            };
        }

        return back()->withErrors([
            'account_id' => 'The provided credentials do not match our records.',
        ])->onlyInput('account_id');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
