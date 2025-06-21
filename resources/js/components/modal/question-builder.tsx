import { useState } from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
  HelpCircle,
  Plus,
  X,
  Check,
  Edit,
  Trash2,
} from "lucide-react";
import type { Question, AssessmentList } from "@/types/utils/instructor-accessability-types";

interface QuestionBuilderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAssessment: AssessmentList | null;
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  onComplete: () => void;
}

export function QuestionBuilderModal({
  open,
  onOpenChange,
  selectedAssessment,
  questions,
  setQuestions,
  onComplete,
}: QuestionBuilderModalProps) {
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: "",
    type: "multiple-choice",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "0",
    points: 1,
  });

  const resetCurrentQuestion = () => {
    setCurrentQuestion({
      id: "",
      type: "multiple-choice",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "0",
      points: 1,
    });
    setEditingQuestionIndex(null);
  };

  const handleQuestionTypeChange = (type: Question["type"]) => {
    const newQuestion = { ...currentQuestion, type };
  
    if (type === "true-false") {
      newQuestion.options = ["True", "False"];
      newQuestion.correctAnswer = "0";
    } else if (type === "multiple-choice") {
      newQuestion.options = ["", "", "", ""];
      newQuestion.correctAnswer = "0";
    } else {
      newQuestion.options = undefined;
      newQuestion.correctAnswer = undefined;
    }
  
    setCurrentQuestion(newQuestion);
  };

  const handleAddOption = () => {
    if (currentQuestion.options && currentQuestion.options.length < 6) {
      setCurrentQuestion({
        ...currentQuestion,
        options: [...currentQuestion.options, ""],
      });
    }
  };

  const handleRemoveOption = (index: number) => {
    if (currentQuestion.options && currentQuestion.options.length > 2) {
      const newOptions = currentQuestion.options.filter((_, i) => i !== index);
      
      let newCorrectAnswer = currentQuestion.correctAnswer;
      const currentAnswerStr = String(currentQuestion.correctAnswer || "0");
      
      if (currentAnswerStr === index.toString()) {
        newCorrectAnswer = "0";
      } else if (parseInt(currentAnswerStr) > index) {
        newCorrectAnswer = (parseInt(currentAnswerStr) - 1).toString();
      }
      
      setCurrentQuestion({
        ...currentQuestion,
        options: newOptions,
        correctAnswer: newCorrectAnswer,
      });
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    if (currentQuestion.options) {
      const newOptions = [...currentQuestion.options];
      newOptions[index] = value;
      setCurrentQuestion({
        ...currentQuestion,
        options: newOptions,
      });
    }
  };

  const handleSaveQuestion = () => {
    if (!currentQuestion.question.trim()) {
      toast("Please enter a question");
      return;
    }
  
    if (currentQuestion.type === "multiple-choice" || currentQuestion.type === "true-false") {
      if (!currentQuestion.correctAnswer && currentQuestion.correctAnswer !== "0") {
        toast("Please select the correct answer");
        return;
      }
      
      if (currentQuestion.options?.some((opt) => !opt.trim())) {
        toast("Please fill in all answer options");
        return;
      }
      
      const correctAnswerStr = String(currentQuestion.correctAnswer);
      const correctIndex = parseInt(correctAnswerStr);
      
      if (isNaN(correctIndex)) {
        toast("Invalid correct answer selection");
        return;
      }
    }
  
    const questionToSave = {
      ...currentQuestion,
      id: currentQuestion.id || Date.now().toString(),
    };
  
    if (editingQuestionIndex !== null) {
      const newQuestions = [...questions];
      newQuestions[editingQuestionIndex] = questionToSave;
      setQuestions(newQuestions);
      toast("Question updated successfully");
    } else {
      setQuestions([...questions, questionToSave]);
      toast("Question added successfully");
    }
  
    resetCurrentQuestion();
  };

  const handleEditQuestion = (index: number) => {
    setCurrentQuestion(questions[index]);
    setEditingQuestionIndex(index);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
    toast("Question deleted");
  };

  const handleSaveAssessment = async () => {
    if (questions.length === 0) {
      toast("Please add at least one question");
      return;
    }
  
    try {
      const invalidQuestions = questions.filter((question, index) => {
        if ((question.type === "multiple-choice" || question.type === "true-false") 
            && (!question.correctAnswer && question.correctAnswer !== "0")) {
          console.error(`Question ${index + 1} has no correct answer:`, question);
          return true;
        }
        return false;
      });
      
      if (invalidQuestions.length > 0) {
        toast(`${invalidQuestions.length} question(s) are missing correct answers. Please review and fix them.`);
        return;
      }
  
      const formattedQuestions = questions.map((question, index) => {
        return {
          type: question.type,
          question: question.question,
          points: question.points,
          options: question.options || null,
          correctAnswer: question.correctAnswer || null,
          order: index
        };
      });
      
      await router.post(
        route('instructor.saveQuestions', { assessment: selectedAssessment?.id }), 
        { questions: formattedQuestions },
        {
          onSuccess: () => {
            console.log("Success! Formatted questions were:", formattedQuestions);
            toast("Assessment saved successfully!", {
              description: `${questions.length} questions have been added to your assessment.`,
            });
            onComplete();
          },
          onError: (error) => {
            console.error('Error saving assessment:', error);
            toast("Error saving assessment. Please try again.");
          }
        }
      );
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast("Error saving assessment. Please try again.");
    }
  };

  const getTotalPoints = () => questions.reduce((total, q) => total + q.points, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[70%] overflow-y-auto max-h-[90%]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" /> Add Questions to "{selectedAssessment?.title}"
            ID: {selectedAssessment?.id}
          </DialogTitle>
          <DialogDescription>
            Create questions for your assessment. You can add multiple choice, true/false, short answer, and essay questions.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingQuestionIndex !== null ? "Edit Question" : "Add New Question"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="question-type">Question Type</Label>
                  <Select value={currentQuestion.type} onValueChange={handleQuestionTypeChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="true-false">True/False</SelectItem>
                      <SelectItem value="short-answer">Short Answer</SelectItem>
                      <SelectItem value="essay">Essay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question-text">Question</Label>
                  <Textarea
                    id="question-text"
                    placeholder="Enter your question here..."
                    value={currentQuestion.question}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="points">Points</Label>
                  <Input
                    id="points"
                    type="number"
                    min="1"
                    max="100"
                    value={currentQuestion.points}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: Number.parseInt(e.target.value) || 1 })}
                  />
                </div>

                {currentQuestion.type === "multiple-choice" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Answer Options</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddOption}
                        disabled={currentQuestion.options?.length >= 6}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Option
                      </Button>
                    </div>
                    <RadioGroup
                      value={currentQuestion.correctAnswer}
                      onValueChange={(value) => setCurrentQuestion({ ...currentQuestion, correctAnswer: value })}
                    >
                      {currentQuestion.options?.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                          <Input
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            className="flex-1"
                          />
                          {currentQuestion.options && currentQuestion.options.length > 2 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveOption(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {currentQuestion.type === "true-false" && (
                  <div className="space-y-3">
                    <Label>Correct Answer</Label>
                    <RadioGroup
                      value={currentQuestion.correctAnswer}
                      onValueChange={(value) => setCurrentQuestion({ ...currentQuestion, correctAnswer: value })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="0" id="true" />
                        <Label htmlFor="true">True</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="false" />
                        <Label htmlFor="false">False</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {(currentQuestion.type === "short-answer" || currentQuestion.type === "essay") && (
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {currentQuestion.type === "short-answer"
                        ? "Students will provide a brief text answer to this question."
                        : "Students will provide a detailed essay response to this question."}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button onClick={handleSaveQuestion} className="flex-1">
                    {editingQuestionIndex !== null ? "Update Question" : "Add Question"}
                  </Button>
                  {editingQuestionIndex !== null && (
                    <Button variant="outline" onClick={resetCurrentQuestion}>
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Questions ({questions.length})</h3>
              <Badge variant="secondary">Total Points: {getTotalPoints()}</Badge>
            </div>

            <div className="space-y-3 max-h-[550px] overflow-y-auto">
              {questions.map((question, index) => (
                <Card key={question.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {question.type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {question.points} pt{question.points !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium mb-2 line-clamp-2">{question.question}</p>
                      {question.type === "multiple-choice" && (
                        <div className="text-xs text-slate-500">
                          Correct: {question.options?.[Number.parseInt(question.correctAnswer || "0")]}
                        </div>
                      )}
                      {question.type === "true-false" && (
                        <div className="text-xs text-slate-500">
                          Correct: {question.correctAnswer === "0" ? "True" : "False"}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                   
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteQuestion(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {questions.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <HelpCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No questions added yet</p>
                  <p className="text-sm">Start by creating your first question</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Save for Later
          </Button>
          <Button onClick={handleSaveAssessment} disabled={questions.length === 0}>
            <Check className="h-4 w-4 mr-2" /> Complete Assessment ({questions.length} questions)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}