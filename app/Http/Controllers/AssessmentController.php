<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\AssessmentAssignment;
use App\Models\ClassInstructor;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AssessmentController extends Controller
{

    public function createAssessment(Request $request){
        $request->validate([
            'instructor_id' => 'required|integer|exists:users,id',
            'subject_id' => 'required|integer|exists:subjects,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
          
           ]);
    
        $assessment = Assessment::create($request->all());
        return back()->with([
            'success' => 'Successfully added an assessment',
            'assessment' => $assessment
        ]);

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


    public function saveQuestions(Request $request, Assessment $assessment)
    {
        $validated = $request->validate([
            'questions' => 'required|array|min:1',
            'questions.*.type' => 'required|in:multiple-choice,true-false,short-answer,essay',
            'questions.*.question' => 'required|string|max:1000',
            'questions.*.points' => 'required|integer|min:1|max:100',
            'questions.*.options' => 'nullable|array',
            'questions.*.options.*' => 'nullable|string|max:500',
            'questions.*.correctAnswer' => 'nullable|string',
        ]);
    
        // Validate question-specific rules
        foreach ($validated['questions'] as $index => $questionData) {
            $questionNumber = $index + 1;
            
            if ($questionData['type'] === 'multiple-choice') {
                if (empty($questionData['options']) || count($questionData['options']) < 2) {
                    return back()->withErrors([
                        'questions' => "Question {$questionNumber}: Multiple choice must have at least 2 options"
                    ]);
                }
                
                // Use is_null() or !== null instead of empty()
                // This properly handles "0" as a valid answer
                if (is_null($questionData['correctAnswer']) || $questionData['correctAnswer'] === '') {
                    return back()->withErrors([
                        'questions' => "Question {$questionNumber}: Please select the correct answer"
                    ]);
                }
            }
            
            // Same fix for true-false questions
            if ($questionData['type'] === 'true-false' && (is_null($questionData['correctAnswer']) || $questionData['correctAnswer'] === '')) {
                return back()->withErrors([
                    'questions' => "Question {$questionNumber}: Please select the correct answer"
                ]);
            }
        }
    
        DB::beginTransaction();
        try {
            // Clear existing questions
            $assessment->questions()->delete();
    
            // Save new questions
            foreach ($validated['questions'] as $index => $questionData) {
                $question = new Question();
                $question->assessment_id = $assessment->id;
                $question->type = $questionData['type'];
                $question->question = $questionData['question'];
                $question->points = $questionData['points'];
                $question->order = $index;
    
                switch ($questionData['type']) {
                    case 'multiple-choice':
                        $question->options = json_encode($questionData['options']);
                        $question->correct_answer = $questionData['correctAnswer'];
                        break;
                        
                    case 'true-false':
                        $question->options = json_encode(['True', 'False']);
                        $question->correct_answer = $questionData['correctAnswer'];
                        break;
                        
                    case 'short-answer':
                    case 'essay':
                        $question->options = null;
                        $question->correct_answer = null;
                        break;
                }
    
                $question->save();
            }
    
            DB::commit();
    
            return back()->with('success', 'Questions saved successfully!');
    
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error saving questions: ' . $e->getMessage()]);
        }
    }


    // BYPASS INERTIA STUPID RENDERING
    public function getQuestions(Assessment $assessment)
    {
        $questions = $assessment->questions()->orderBy('order')->get();
        
        // For API response (non-Inertia)
        return response()->json([
            'questions' => $questions->map(function($question) {
                return [
                    'id' => $question->id,
                    'type' => $question->type,
                    'question' => $question->question,
                    'options' => json_decode($question->options, true), // Properly decode JSON
                    'correctAnswer' => $question->correct_answer,
                    'points' => $question->points,
                    'order' => $question->order
                ];
            })
        ]);
    }
}
