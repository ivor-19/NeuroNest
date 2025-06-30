<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\AssessmentAssignment;
use App\Models\ClassInstructor;
use App\Models\Question;
use App\Models\StudentGrades;
use App\Models\StudentProfile;
use App\Models\StudentResponse;
use App\Models\User;
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
    
        // $existingAssignment = AssessmentAssignment::where([
        //     'assessment_id' => $request->assessment_id,
        //     'course_id' => $request->course_id,
        //     'year_level' => $request->year_level,
        //     'section' => $request->section,
        // ])->exists();
    
        // if ($existingAssignment) {
        //     return back()->withErrors([
        //         'message' => 'There is already an assessment dedicated for this section.'
        //     ]);
        // }
    
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

    public function getRespondents(Request $request)
    {
        $assessmentId = $request->query('assessment_id');
        $courseId = $request->query('course_id');
        $yearLevel = $request->query('year_level');
        $section = $request->query('section');
    
        // 🔢 Total number of questions
        $totalItems = Question::where('assessment_id', $assessmentId)->count();
    
        // 🧮 Total possible points (sum of question points)
        $totalPossiblePoints = Question::where('assessment_id', $assessmentId)->sum('points');
    
        // 👥 Get all student profiles in the class
        $studentProfiles = StudentProfile::with('student', 'course')
            ->where('course_id', $courseId)
            ->where('year_level', $yearLevel)
            ->where('section', $section)
            ->get();
    
        $studentIds = $studentProfiles->pluck('student_id');
    
        // 📊 Responses grouped by student
        $responses = StudentResponse::select(
                'student_id',
                DB::raw('SUM(points_earned) as total_points')
            )
            ->where('assessment_id', $assessmentId)
            ->whereIn('student_id', $studentIds)
            ->groupBy('student_id')
            ->get()
            ->keyBy('student_id');
    
        // 🧾 Final student data with status
        $students = $studentProfiles->map(function ($profile) use ($responses) {
            $student = $profile->student;
            $course = $profile->course;
            $response = $responses[$profile->student_id] ?? null;
    
            return [
                'student_id' => $profile->student_id,
                'name' => $student?->name ?? 'N/A',
                'email' => $student?->email ?? 'N/A',
                'course_code' => $course?->code ?? 'N/A',
                'year_level' => $profile->year_level,
                'section' => $profile->section,
                'total_points' => $response?->total_points ?? 0,
                'status' => $response ? 'Completed' : 'Not Started',
            ];
        });
    
        return response()->json([
            'total_items' => $totalItems,
            'total_points' => $totalPossiblePoints,
            'students' => $students,
        ]);
    }

    public function getStudentGrades(Request $request, $assessmentId, $courseId, $yearLevel, $section)
    {
        // Get the assessment assignment with basic validation
        $assignment = AssessmentAssignment::with('course')
            ->where([
                'assessment_id' => $assessmentId,
                'course_id' => $courseId,
                'year_level' => $yearLevel,
                'section' => $section
            ])
            ->firstOrFail();

        // Get assessment with minimal data
        $assessment = Assessment::with('subject:id,name')
            ->select('id', 'title', 'description', 'subject_id')
            ->findOrFail($assessmentId);

        // Get students - simplified without enrollments
        $students = User::where('course_id', $courseId)
            ->where('year_level', $yearLevel)
            ->where('section', $section)
            ->select('id', 'name', 'account_id')
            ->get();

        // Get grades in a single query
        $grades = StudentGrades::where('assessment_id', $assessmentId)
            ->whereIn('student_id', $students->pluck('id'))
            ->select('student_id', 'score', 'updated_at as graded_at')
            ->get()
            ->keyBy('student_id');

        // Transform data more efficiently
        $studentGrades = $students->map(function($student) use ($grades) {
            $grade = $grades[$student->id] ?? null;
            
            return [
                'id' => $student->id,
                'name' => $student->name,
                'account_id' => $student->account_id,
                'score' => $grade?->score,
                'graded_at' => $grade?->graded_at,
                'status' => $grade ? 'Graded' : 'Pending'
            ];
        });

        return Inertia::render('Grades/Index', [
            'meta' => [
                'course' => $assignment->course->only('code', 'name'),
                'year_level' => $yearLevel,
                'section' => $section,
                'graded_count' => $grades->count(),
                'total_students' => $students->count()
            ],
            'assessment' => $assessment,
            'assignment' => $assignment->only('opened_at', 'closed_at', 'is_available'),
            'studentGrades' => $studentGrades
        ]);
    }

    public function submitAssessment(Request $request)
    {
        // Validate that we receive an array of responses
        $request->validate([
            'responses' => 'required|array',
            'responses.*.assessment_id' => 'required|integer|exists:assessments,id',
            'responses.*.question_id' => 'required|integer|exists:questions,id',
            'responses.*.student_id' => 'required|integer|exists:users,id',
            'responses.*.answer' => 'nullable|string|max:255',
            'responses.*.is_correct' => 'boolean',
            'responses.*.points_earned' => 'integer'
        ]);
    
        // Create multiple records
        foreach ($request->responses as $response) {
            StudentResponse::create($response);
        }
    
    
        return back()->with([
            'success' => 'Successfully finished assessment',
        ]);
    }

    public function storeGrades(Request $request) {
        $request->validate([
            'assessment_id' => 'required|integer|exists:assessments,id',
            'student_id' => 'required|integer|exists:users,id',
            'score' => 'required|string|max:255',
          
           ]);
    
        StudentGrades::create($request->all());
        return back()->with([
            'success' => 'Successfully totalled',
        ]);
    }

    public function deleteAssessment(Request $request, Assessment $assessment)
    {
        $assessment->delete();
        
        return back()->with('success', 'Assessment deleted successfully');
    }

    public function removeAssignedAssessment($id)
    {
        $assignment = AssessmentAssignment::findOrFail($id);
        $assignment->delete();

        return back()->with('success', 'Assignment deleted successfully.');
    }
}
