<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\AssessmentAssignment;
use Illuminate\Http\Request;

class AssessmentController extends Controller
{
    public function createAssessment(Request $request){
        $request->validate([
            'instructor_id' => 'required|integer|exists:users,id',
            'subject_id' => 'required|integer|exists:subjects,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
          
           ]);
    
        Assessment::create($request->all());
        return redirect()->back()->with('success',`Successfully added a assessment`);

    }

    public function assessmentAvailability($id)
    {
        $assessmentAccess = AssessmentAssignment::findOrFail($id);
        
        // Toggle the is_available status
        $assessmentAccess->is_available = !$assessmentAccess->is_available;
        $assessmentAccess->save();
        
        return redirect()->back();
    }

    public function assignAssessment(Request $request){
        $request->validate([
            'assessment_id' => 'required|exists:assessments,id',
            'course_id' => 'required|exists:courses,id',
            'year_level' => 'required|string',
            'section' => 'required|string',
            'is_available' => 'required|boolean',
            'opened_at' => 'nullable',
            'closed_at' => 'nullable',
        ]);
    
        $existingAssignment = AssessmentAssignment::where([
            'assessment_id' => $request->assessment_id,
            'course_id' => $request->course_id,
            'year_level' => $request->year_level,
            'section' => $request->section,
        ])->exists();
    
        if ($existingAssignment) {
            return back()->withErrors([
                'message' => 'There is already an assessment dedicated for this section.'
            ]);
        }
    
        AssessmentAssignment::create($request->all());
        return back()->with('success', 'Successfully assigned');
    }
}
