<?php

namespace App\Http\Controllers;

use App\Models\ClassInstructor;
use App\Models\Module;
use App\Models\ModuleAccess;
use App\Models\ModuleCompletion;
use App\Models\ModuleControl;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ModuleController extends Controller
{
  // Admin
  public function addModule(Request $request)
  {
    $validator = Validator::make($request->all(), [
        'subject_id' => 'required|integer|exists:subjects,id',
        'creator_id' => 'required|integer|exists:users,id',
        'title' => 'required|string|max:255',
        'description' => 'required|string|max:255',
        'status' => 'required|string',
        'order' => [
            'required',
            'integer',
            Rule::unique('modules')->where(function ($query) use ($request) {
                return $query->where('subject_id', $request->subject_id);
            }),
        ],
        'pdf' => 'required|file|mimes:pdf|max:10240',
    ]);

    if ($validator->fails()) {
        return back()->withErrors($validator)->withInput();
    }

    $pdfPath = $request->file('pdf')->store('modules/pdfs', 'public');

    Module::create([
        'subject_id' => $request->subject_id,
        'creator_id' => $request->creator_id,
        'title' => $request->title,
        'description' => $request->description,
        'status' => $request->status,
        'order' => $request->order,
        'pdf' => $pdfPath,
    ]);

    return redirect()->back()->with('success', 'Module added successfully!');
  }

  public function updateModule(Request $request, $id)
  {
      // Find the existing module
      $module = Module::findOrFail($id);
  
      // Basic validation (same as addModule but make PDF optional)
      $validated = $request->validate([
          'subject_id' => 'required|integer|exists:subjects,id',
          'title' => 'required|string|max:255',
          'description' => 'required|string|max:255',
          'status' => 'required|string',
          'order' => 'required|integer',
          'pdf' => 'sometimes|file|mimes:pdf|max:10240', // Make PDF optional with 'sometimes'
      ]);
  
      // Handle PDF file update if provided
      if ($request->hasFile('pdf')) {
          // Delete the old PDF file if it exists
          if ($module->pdf) {
              Storage::disk('public')->delete($module->pdf);
          }
          
          // Store the new PDF file
          $pdfPath = $request->file('pdf')->store('modules/pdfs', 'public');
          $validated['pdf'] = $pdfPath;
      }
  
      // Update the module
      $module->update($validated);
  
      return redirect()->back()->with('success', 'Module updated successfully');
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
