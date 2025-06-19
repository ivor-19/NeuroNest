"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle } from "lucide-react"

interface QuestionResponse {
  questionId: number
  question: string
  studentAnswer: string
  correctAnswer: string
  isCorrect: boolean
  pointsEarned: number
  totalPoints: number
  feedback?: string
  questionType: "multiple-choice" | "true-false" | "short-answer" | "essay"
}

interface AssessmentResults {
  totalPoints: number
  earnedPoints: number
  percentage: number
  responses: QuestionResponse[]
}

interface AssessmentInfo {
  title: string
  subject: string
  submittedAt: string
}

interface ResultsModalProps {
  isOpen: boolean
  onClose: () => void
  results: AssessmentResults | null
  assessmentInfo: AssessmentInfo | null
  onBackToList: () => void
}

export default function ResultsModal({ isOpen, onClose, results, assessmentInfo, onBackToList }: ResultsModalProps) {
  if (!results || !assessmentInfo) return null

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 80) return "text-blue-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getGradeLetter = (percentage: number) => {
    if (percentage >= 97) return "A+"
    if (percentage >= 93) return "A"
    if (percentage >= 90) return "A-"
    if (percentage >= 87) return "B+"
    if (percentage >= 83) return "B"
    if (percentage >= 80) return "B-"
    if (percentage >= 77) return "C+"
    if (percentage >= 73) return "C"
    if (percentage >= 70) return "C-"
    if (percentage >= 67) return "D+"
    if (percentage >= 65) return "D"
    return "F"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            Assessment Results
          </DialogTitle>
          <DialogDescription className="text-base">
            <div className="space-y-1">
              <div>
                <strong>{assessmentInfo.title}</strong>
              </div>
              <div className="text-sm text-muted-foreground">{assessmentInfo.subject}</div>
              <div className="text-sm text-muted-foreground">Submitted: {assessmentInfo.submittedAt}</div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          {/* Score Summary */}
          <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className={`text-6xl font-bold mb-2 ${getGradeColor(results.percentage)}`}>
                  {results.percentage}%
                </div>
                <div className={`text-2xl font-semibold mb-1 ${getGradeColor(results.percentage)}`}>
                  Grade: {getGradeLetter(results.percentage)}
                </div>
                <div className="text-muted-foreground">
                  {results.earnedPoints} out of {results.totalPoints} points
                </div>
              </div>

              <div className="space-y-4">
                <Progress value={results.percentage} className="h-4 bg-white/50" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="text-center bg-white/50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {results.responses.filter((r) => r.isCorrect).length}
                    </div>
                    <div className="text-sm text-green-600 font-medium">Correct</div>
                  </div>
                  <div className="text-center bg-white/50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-red-600 mb-1">
                      {results.responses.filter((r) => !r.isCorrect).length}
                    </div>
                    <div className="text-sm text-red-600 font-medium">Incorrect</div>
                  </div>
                  <div className="text-center bg-white/50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{results.responses.length}</div>
                    <div className="text-sm text-blue-600 font-medium">Total Questions</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question Results */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Detailed Results</h3>
              <Badge variant="outline" className="text-sm">
                {results.responses.filter((r) => r.isCorrect).length}/{results.responses.length} Correct
              </Badge>
            </div>

            <div className="space-y-4">
              {results.responses.map((response, index) => (
                <Card
                  key={response.questionId}
                  className={`border-l-4 transition-all hover:shadow-md ${
                    response.isCorrect
                      ? "border-l-green-500 bg-green-50/30 hover:bg-green-50/50"
                      : "border-l-red-500 bg-red-50/30 hover:bg-red-50/50"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-sm">
                          Question {index + 1}
                        </Badge>
                        <Badge
                          className={`text-sm ${
                            response.isCorrect
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {response.pointsEarned}/{response.totalPoints} points
                        </Badge>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {response.questionType.replace("-", " ")}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {response.isCorrect ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            <span className="text-sm font-medium">Correct</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-600">
                            <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center">
                              <span className="text-xs font-bold">✕</span>
                            </div>
                            <span className="text-sm font-medium">Incorrect</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white/70 rounded-lg p-4">
                        <p className="font-medium text-sm mb-2 text-gray-700">Question:</p>
                        <p className="text-sm text-gray-800 leading-relaxed">{response.question}</p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <p className="font-medium text-sm mb-2 text-gray-700">Your Answer:</p>
                          <div
                            className={`text-sm p-3 rounded-lg border-2 ${
                              response.isCorrect
                                ? "bg-green-50 border-green-200 text-green-800"
                                : "bg-red-50 border-red-200 text-red-800"
                            }`}
                          >
                            {response.studentAnswer || <span className="italic text-gray-500">No answer provided</span>}
                          </div>
                        </div>

                        {response.correctAnswer &&
                          response.questionType !== "essay" &&
                          response.questionType !== "short-answer" && (
                            <div>
                              <p className="font-medium text-sm mb-2 text-gray-700">Correct Answer:</p>
                              <div className="text-sm p-3 rounded-lg bg-green-50 border-2 border-green-200 text-green-800">
                                {response.correctAnswer}
                              </div>
                            </div>
                          )}
                      </div>

                      {response.feedback && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="font-medium text-sm mb-1 text-blue-800">Feedback:</p>
                          <p className="text-sm text-blue-700">{response.feedback}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t">
            <Button variant="outline" onClick={onClose} className="rounded-xl px-6">
              Close Results
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => window.print()} className="rounded-xl px-6">
                Print Results
              </Button>
              <Button onClick={onBackToList} className="rounded-xl px-6">
                Back to Assessments
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
