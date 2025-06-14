<?php

namespace App\Http\Controllers;

use App\Models\ClassInstructor;
use App\Models\ModuleAccess;
use App\Models\ModuleControl;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ModuleAccessController extends Controller
{
  // Show instructor's sections and modules
  public function index()
  {
      $instructorId = auth()->id();
      
      $classSections = ClassInstructor::where('instructor_id', $instructorId)
          ->with(['subject', 'course', 'moduleAccess.module'])
          ->get();
          
      return Inertia::render('Instructor/ModuleAccess', [
          'classSections' => $classSections
      ]);
  }

  // Toggle module access
  public function toggleAccess(Request $request)
  {
      $moduleAccess = ModuleAccess::findOrFail($request->access_id);
      
      // Check if instructor owns this
      $classInstructor = $moduleAccess->classInstructor;
      if ($classInstructor->instructor_id !== auth()->id()) {
          return response()->json(['error' => 'Unauthorized'], 403);
      }
      
      $moduleAccess->update([
          'is_available' => !$moduleAccess->is_available
      ]);
      
      return response()->json([
          'success' => true,
          'is_available' => $moduleAccess->is_available
      ]);
  }
}
