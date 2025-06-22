<?php

namespace App\Http\Controllers;

use App\Models\ClassInstructor;
use App\Models\Module;
use App\Models\ModuleAccess;
use App\Models\ModuleCompletion;
use App\Models\ModuleControl;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ModuleController extends Controller
{
  // Admin
  public function addModule(Request $request)
  {
      $request->validate([
          'subject_id' => 'required|integer|exists:subjects,id',
          'creator_id' => 'required|integer|exists:users,id',
          'title' => 'required|string|max:255',
          'description' => 'required|string|max:255',
          'status' => 'required|string',
          'order' => 'required|integer',
          'pdf' => 'required|file|mimes:pdf|max:10240', // 10MB max
      ]);
  
      // Handle file upload
      $pdfPath = null;
      if ($request->hasFile('pdf')) {
          $pdfPath = $request->file('pdf')->store('modules/pdfs', 'public');
      }
  
      // Create module with file path
      Module::create([
          'subject_id' => $request->subject_id,
          'creator_id' => $request->creator_id,
          'title' => $request->title,
          'description' => $request->description,
          'status' => $request->status,
          'order' => $request->order,
          'pdf' => $pdfPath, // Store the file path
      ]);
  
      return redirect()->back()->with('success', 'Successfully added a module');
  }

  public function deleteModule($id){
      $module = Module::findOrFail($id);  
      $module->delete();

      return redirect()->back()->with('success','Deleted a module');
  }


  // Instructor
  public function moduleAvailability($id)
    {
        $moduleAccess = ModuleAccess::findOrFail($id);
        
        // Toggle the is_available status
        $moduleAccess->is_available = !$moduleAccess->is_available;
        $moduleAccess->save();
        
        return redirect()->back();
    }

    public function moduleCompletion(Request $request)
    {
        $request->validate([
            'student_id' => 'required|integer|exists:users,id',
            'module_id' => 'required|integer|exists:modules,id',

        ]);
    
        // Create module with file path
        ModuleCompletion::create([
            'student_id' => $request->student_id,
            'module_id' => $request->module_id,
            'is_done' => true,

        ]);
    
        return redirect()->back()->with('success', 'Successfully finish a module');
    }

    public function download($moduleId)
    {
        $module = Module::findOrFail($moduleId);
        
        if (!$module->pdf || !Storage::disk('public')->exists($module->pdf)) {
            return redirect()->back()->with('error', 'PDF file not found');
        }
        
        $fileName = $module->title . '.pdf';
        
        return Storage::disk('public')->download($module->pdf, $fileName);
    }
}
