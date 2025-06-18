<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = [
        'assessment_id', 'type', 'question', 'points', 
        'options', 'correct_answer', 'order'
    ];

    protected $casts = [
        'options' => 'array', // Automatically handle JSON conversion
        'points' => 'integer'
    ];

    public function assessment()
    {
        return $this->belongsTo(Assessment::class);
    }

    public function responses()
    {
        return $this->hasMany(StudentResponse::class);
    }

     // Check if student's answer is correct
     public function checkAnswer($studentAnswer)
     {
         switch ($this->type) {
             case 'multiple-choice':
             case 'true-false':
                 return $studentAnswer === $this->correct_answer;
             
             case 'short-answer':
             case 'essay':
                 // These require manual grading
                 return null;
                 
             default:
                 return false;
         }
     }
 
     // Get formatted options for display
     public function getFormattedOptionsAttribute()
     {
         if ($this->type === 'true-false') {
             return ['True', 'False'];
         }
         
         return $this->options ?? [];
     }
 
     // Get correct answer text for display
     public function getCorrectAnswerTextAttribute()
     {
         switch ($this->type) {
             case 'multiple-choice':
                 $options = $this->options ?? [];
                 $index = (int) $this->correct_answer;
                 return $options[$index] ?? 'Unknown';
                 
             case 'true-false':
                 return $this->correct_answer === '0' ? 'True' : 'False';
                 
             default:
                 return null;
         }
     }
}
