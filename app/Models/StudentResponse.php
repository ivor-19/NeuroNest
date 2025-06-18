<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentResponse extends Model
{
    protected $fillable = [
        'assessment_id', 'question_id', 'student_id', 
        'answer', 'is_correct', 'points_earned', 'feedback'
    ];

    protected $casts = [
        'is_correct' => 'boolean',
        'points_earned' => 'decimal:2'
    ];

    public function assessment()
    {
        return $this->belongsTo(Assessment::class);
    }

    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    // Auto-grade the response if possible
    public function autoGrade()
    {
        $question = $this->question;
        $isCorrect = $question->checkAnswer($this->answer);
        
        if ($isCorrect !== null) {
            $this->is_correct = $isCorrect;
            $this->points_earned = $isCorrect ? $question->points : 0;
            $this->save();
        }
    }
}
