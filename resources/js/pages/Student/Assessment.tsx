"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Clock,
  FileText,
  ArrowLeft,
  CheckCircle,
  User,
  Calendar,
  BookOpen,
  Search,
  Filter,
  MoreHorizontal,
  Play,
  Timer,
  AlertTriangle,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import HeaderLayout from "@/layouts/header-layout"
import { Head } from "@inertiajs/react"
import { AssessmentAssignment, Question, StudentAssessmentProps } from "@/types/utils/student-assessment-types"


export default function Assessment({ assessments, studentProfile }: StudentAssessmentProps) {
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentAssignment | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [courseFilter, setCourseFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Get status for each assessment
  const getAssessmentStatus = (assessment: AssessmentAssignment) => {
    if (isSubmitted) return "completed"

    const now = new Date()
    const openedAt = assessment.opened_at ? new Date(assessment.opened_at) : null
    const closedAt = assessment.closed_at ? new Date(assessment.closed_at) : null

    if (assessment.is_available === 0) return "upcoming"
    if (closedAt && now > closedAt) return "overdue"
    if (openedAt && now >= openedAt) return "available"

    return "upcoming"
  }

  // Get unique courses and statuses for filter options
  const uniqueCourses = [...new Set(assessments.map((assessment) => assessment.course.code || assessment.course.title))]
  const uniqueStatuses = ["available", "completed", "overdue", "upcoming"]

  // Filter assessments based on search and filters
  const filteredAssessments = assessments.filter((assessment) => {
    const searchTermLower = searchTerm.toLowerCase()
    const matchesSearch =
      searchTerm === "" ||
      assessment.assessment.title.toLowerCase().includes(searchTermLower) ||
      assessment.course.code?.toLowerCase().includes(searchTermLower) ||
      "" ||
      assessment.course.title.toLowerCase().includes(searchTermLower)

    const matchesCourse =
      courseFilter === "all" || assessment.course.code === courseFilter || assessment.course.title === courseFilter

    const status = getAssessmentStatus(assessment)
    const matchesStatus = statusFilter === "all" || status === statusFilter

    return matchesSearch && matchesCourse && matchesStatus
  })

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleSubmitAssessment = () => {
    console.log("Assessment Answers:", {
      assessmentId: selectedAssessment?.assessment.id,
      studentId: studentProfile.student_id,
      answers: answers,
      submittedAt: new Date().toISOString(),
    })
    setIsSubmitted(true)
  }

  const handleBackToList = () => {
    setSelectedAssessment(null)
    setCurrentQuestionIndex(0)
    setAnswers({})
    setIsSubmitted(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200"
      case "upcoming":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case "exam":
        return <FileText className="h-4 w-4" />
      case "quiz":
        return <Timer className="h-4 w-4" />
      case "presentation":
        return <Play className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const renderQuestion = (question: Question) => {
    const currentAnswer = answers[question.id] || ""

    // Parse the options if they exist
    let parsedOptions: string[] = []
    if (question.options) {
      try {
        // If options is already an array, use it directly
        if (Array.isArray(question.options)) {
          parsedOptions = question.options
        } else {
          // Otherwise, parse it as JSON
          parsedOptions = JSON.parse(question.options)
        }
      } catch (e) {
        console.error("Failed to parse question options:", e)
        parsedOptions = []
      }
    }

    switch (question.type) {
      case "multiple-choice":
        return (
          <div className="space-y-3">
            <RadioGroup value={currentAnswer} onValueChange={(value) => handleAnswerChange(question.id, value)}>
              {parsedOptions.map((option, index) => {
                const isSelected = currentAnswer === option
                return (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 rounded-xl border-2 transition-all cursor-pointer${
                      isSelected
                        ? "border-primary bg-accent shadow-md"
                        : "border-border hover:border-primary/50 hover:bg-primary/5"
                    }`}
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} className="mt-0.5 ml-4 bg-muted" />
                    <Label
                      htmlFor={`option-${index}`}
                      className={`cursor-pointer flex-1 text-sm leading-relaxed  p-4 ${
                        isSelected ? "font-medium text-primary" : ""
                      }`}
                    >
                      {option}
                    </Label>
                  </div>
                )
              })}
            </RadioGroup>
          </div>
        )

      case "true-false":
        return (
          <div className="space-y-3">
            <RadioGroup value={currentAnswer} onValueChange={(value) => handleAnswerChange(question.id, value)}>
              <div
                className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  currentAnswer === "true"
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                <RadioGroupItem value="true" id="true" />
                <Label
                  htmlFor="true"
                  className={`cursor-pointer flex-1 text-sm font-medium ${
                    currentAnswer === "true" ? "text-primary" : ""
                  }`}
                >
                  True
                </Label>
              </div>
              <div
                className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  currentAnswer === "false"
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                <RadioGroupItem value="false" id="false" />
                <Label
                  htmlFor="false"
                  className={`cursor-pointer flex-1 text-sm font-medium ${
                    currentAnswer === "false" ? "text-primary" : ""
                  }`}
                >
                  False
                </Label>
              </div>
            </RadioGroup>
          </div>
        )

      case "short-answer":
        return (
          <div className="space-y-3">
            <Input
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Enter your answer..."
              className={`w-full text-sm p-4 border-2 rounded-xl transition-all ${
                currentAnswer
                  ? "border-primary bg-primary/5 focus:border-primary"
                  : "border-border focus:border-primary"
              }`}
            />
            {currentAnswer && (
              <div className="flex items-center gap-2 text-xs text-green-600">
                <CheckCircle className="h-3 w-3" />
                Answer provided
              </div>
            )}
          </div>
        )

      case "essay":
        return (
          <div className="space-y-3">
            <Textarea
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Write your essay answer here..."
              className={`min-h-[250px] w-full text-sm p-4 border-2 resize-none rounded-xl transition-all ${
                currentAnswer
                  ? "border-primary bg-primary/5 focus:border-primary"
                  : "border-border focus:border-primary"
              }`}
            />
            <div className="flex justify-between items-center">
              <div className="text-xs text-muted-foreground">{currentAnswer.length} characters</div>
              {currentAnswer && (
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  Answer provided
                </div>
              )}
            </div>
          </div>
        )

      default:
        return <div>Unsupported question type</div>
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader className="pb-8 pt-12">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-14 w-14 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-3xl text-green-600 mb-4">Assessment Submitted Successfully!</CardTitle>
            <CardDescription className="text-lg">
              Your answers have been recorded and submitted for grading.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-12">
            <div className="bg-muted rounded-xl p-6 mb-8 text-left">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Assessment:</span>
                  <span className="text-sm">{selectedAssessment?.assessment.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Course:</span>
                  <span className="text-sm">{selectedAssessment?.course.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Submitted:</span>
                  <span className="text-sm">{new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>
            <Button onClick={handleBackToList} size="lg" className="px-12 py-3 rounded-xl">
              Back to Assessments
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (selectedAssessment) {
    const questions = selectedAssessment.assessment.questions || []
    const currentQuestion = questions[currentQuestionIndex]
    const answeredCount = questions.filter((q) => answers[q.id]).length
    const progressPercentage = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0

    if (!currentQuestion) {
      return <div>No questions available for this assessment.</div>
    }

    return (
      <HeaderLayout>
        <Head title={selectedAssessment.assessment.title} />
        <div className="min-h-screen mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">
            {/* Combined Header with Progress */}
            <Card className="bg-gradient-to-r from-primary/5 via-primary/3 to-primary/5 border-primary/20 shadow-lg">
              <CardHeader className="pb-6">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost"className="flex items-center gap-2 hover:bg-white/50">
                          <ArrowLeft className="h-4 w-4" />Back to Assessments
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                            <AlertDialogTitle>Are you sure you want to go back?</AlertDialogTitle>
                          </div>
                          <AlertDialogDescription>
                            Your progress might get unsaved. Any changes you've made will be lost if you continue without saving.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Stay on Page</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleBackToList}>Yes, Go Back</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Separator orientation="vertical" className="h-6" />
                    <div>
                      <CardTitle className="text-2xl mb-1">{selectedAssessment.assessment.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {selectedAssessment.assessment.subject?.code} - {selectedAssessment.assessment.subject?.title}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {/* <div className="text-center px-4 py-2 rounded-xl">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Clock className="h-4 w-4" />
                        Duration
                      </div>
                      <div className="font-bold">{selectedAssessment.assessment.duration || 0} mins</div>
                    </div> */}
                    <div className="text-center  px-4 py-2 rounded-xl">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <FileText className="h-4 w-4" />
                        Questions
                      </div>
                      <div className="font-bold">{questions.length}</div>
                    </div>
                    <div className="text-center  backdrop-blur-sm px-4 py-2 rounded-xl">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <CheckCircle className="h-4 w-4" />
                        Total Points
                      </div>
                      <div className="font-bold">{selectedAssessment.assessment.total_points}</div>
                    </div>
                  </div>
                </div>
    
                {/* Progress Section */}
                <div className="backdrop-blur-sm rounded-xl p-6 border">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-lg font-semibold mb-1">Assessment Progress</div>
                      <div className="text-sm text-muted-foreground">
                        Keep track of your completion status • {answeredCount} of {questions.length} questions completed
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div
                          className={`text-3xl font-bold mb-1 ${progressPercentage === 100 ? "text-green-600" : "text-primary"}`}
                        >
                          {Math.round(progressPercentage)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Complete</div>
                      </div>
                      {progressPercentage === 100 && (
                        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-200">
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-medium text-sm">Ready to submit</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Progress
                    value={progressPercentage}
                    className={`h-3 mb-3 ${progressPercentage === 100 ? "[&>div]:bg-green-500" : ""}`}
                  />
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Started</span>
                    <span>Complete</span>
                  </div>
                </div>
              </CardHeader>
            </Card>
    
            {/* Question */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Question Navigation */}
              <Card className="lg:col-span-1 h-96">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5" />
                    Question Navigator
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Click on any question number to jump to it. Green indicates completed questions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex flex-col justify-between h-full">
                  <div className="grid grid-cols-4 lg:grid-cols-5 gap-2">
                    {questions.map((question, index) => {
                      const isAnswered = answers[question.id]
                      const isCurrent = index === currentQuestionIndex
    
                      return (
                        <Button
                          key={question.id}
                          variant={isCurrent ? "default" : isAnswered ? "secondary" : "outline"}
                          size="sm"
                          className={`h-10 w-10 p-0 text-xs font-medium rounded-xl transition-all duration-200 ${
                            isCurrent
                              ? "bg-primary text-primary-foreground shadow-lg scale-105"
                              : isAnswered
                                ? "bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                                : "hover:bg-muted hover:scale-105"
                          }`}
                          onClick={() => setCurrentQuestionIndex(index)}
                        >
                          {isAnswered && !isCurrent && (
                            <CheckCircle className="h-3 w-3 absolute -top-1 -right-1 text-green-600 bg-white rounded-full" />
                          )}
                          {index + 1}
                        </Button>
                      )
                    })}
                  </div>
                  <Button onClick={handleSubmitAssessment} className="w-full rounded-xl" size="lg">
                    Submit Assessment
                  </Button>
                </CardContent>
              </Card>
    
              {/* Add this right before the Question Content Card */}
              <div className="lg:col-span-3">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4 dark:bg-blue-900/20 dark:border-blue-800/30">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 dark:bg-blue-900/40">
                      <span className="text-blue-600 text-xs font-bold dark:text-blue-300">!</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1 dark:text-blue-100">Instructions</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300/80">
                        Read each question carefully and select your answer. You can navigate between questions using the
                        buttons below or the question navigator on the left. Make sure to review all your answers before
                        submitting.
                      </p>
                    </div>
                  </div>
                </div>
    
                {/* Question Content Card starts here */}
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">
                          Question {currentQuestionIndex + 1} of {questions.length}
                        </Badge>
                        <Badge>{currentQuestion.points} points</Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-relaxed">{currentQuestion.question}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {renderQuestion(currentQuestion)}
    
                    <div className="flex justify-between items-center pt-6 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="rounded-xl"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
    
                      <div className="text-sm text-muted-foreground">
                        Question {currentQuestionIndex + 1} of {questions.length}
                      </div>
    
                      <Button
                        onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                        disabled={currentQuestionIndex === questions.length - 1}
                        className="rounded-xl"
                      >
                        Next
                        <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </HeaderLayout>
    )
  }

  return (
    <HeaderLayout>
      <Head title="Assessments" />
      <div className="min-h-screen mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">
          {/* Header */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    My Assessments
                  </h1>
                  <p className="text-muted-foreground mb-4 text-lg">
                    Complete your assigned assessments and track your academic progress
                  </p>
                  <div className="flex items-center gap-6 text-muted-foreground">
                    <span className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
                      <BookOpen className="h-4 w-4" />
                      {studentProfile.year_level} - Section {studentProfile.section}
                    </span>
                    <span className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
                      <Calendar className="h-4 w-4" />
                      Academic Year {studentProfile.academic_year}
                    </span>
                  </div>
                </div>
                <div className="text-right bg-primary/5 p-6 rounded-2xl border border-primary/20">
                  <div className="text-3xl font-bold text-primary mb-1">{filteredAssessments.length}</div>
                  <div className="text-sm text-muted-foreground">Available</div>
                  <div className="text-sm text-muted-foreground">Assessments</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card className="border-2 border-dashed border-muted-foreground/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Filter className="h-5 w-5" />
                    Filter & Search Assessments
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Find specific assessments by course, status, or search terms
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">
                  {filteredAssessments.length} results
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <Label htmlFor="search" className="text-sm font-medium mb-2 block">
                    Search Assessments
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="search"
                      placeholder="Search by title, course code, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 rounded-xl"
                    />
                  </div>
                </div>

                {/* Course Filter */}
                <div className="w-full sm:w-[220px]">
                  <Label className="text-sm font-medium mb-2 block">Course</Label>
                  <Select value={courseFilter} onValueChange={setCourseFilter}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="All Courses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      {uniqueCourses.map((course) => (
                        <SelectItem key={course} value={course}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div className="w-full sm:w-[220px]">
                  <Label className="text-sm font-medium mb-2 block">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {uniqueStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assessments Grid */}
          <div className="flex flex-col">
            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">Showing {filteredAssessments.length} assessments</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssessments.map((assessmentAssignment) => {
                const { assessment, course } = assessmentAssignment
                const status = getAssessmentStatus(assessmentAssignment)
                const isAvailable = status === "available"
                const closedAt = assessmentAssignment.closed_at ? new Date(assessmentAssignment.closed_at) : null
                const isOverdue = closedAt && new Date() > closedAt

                return (
                  <Card key={assessmentAssignment.id} className="hover:shadow-lg transition-all duration-200">
                    <CardHeader>                     
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                          {assessment.subject?.code}
                          <span className="text-base">-  {assessment.subject?.title}</span>
                      </CardTitle>                               
                      <CardDescription className="flex flex-col gap-2">
                        <div className="font-medium text-foreground">{assessment.title}</div>
                        {/* <Badge variant="outline" className={getStatusColor(status)}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge> */}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {assessment.description && (
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-sm text-muted-foreground line-clamp-2">{assessment.description}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {/* <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Duration
                            </span>
                            <span className="font-medium">{assessment.duration || 0} min</span>
                          </div> */}

                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              Questions
                            </span>
                            <span className="font-medium">{assessment.questions?.length || 0}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Points
                            </span>
                            <Badge variant="secondary">{assessment.total_points} pts</Badge>
                          </div>

                          {/* <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              Type
                            </span>
                            <span className="font-medium capitalize">{assessment.type || "Assessment"}</span>
                          </div> */}
                        </div>

                        <div className="bg-orange-50 border border-orange-300 p-3 rounded-lg dark:bg-orange-900/20 dark:border-orange-700/80">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-orange-700 font-medium flex items-center gap-1 dark:text-orange-300">
                              <Calendar className="h-3 w-3" />
                              Due Date
                            </span>
                            <span className={`font-medium ${isOverdue ? "text-red-600 dark:text-red-400" : "text-orange-700 dark:text-orange-300"}`}>
                              {closedAt ? (
                                <>
                                  {closedAt.toLocaleDateString()} at{" "}
                                  {closedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </>
                              ):(
                                <>No assigned date</>
                              )}
                            </span>
                          </div>
                          {isOverdue && <p className="text-xs text-red-600 mt-1 dark:text-red-400">This assessment is overdue</p>}
                        </div>
                                              

                        <div className="flex space-x-2 pt-2">
                          <Button
                            size="sm"
                            className="flex-1 rounded-xl"
                            disabled={!assessmentAssignment.is_available}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (assessmentAssignment.is_available) {
                                setSelectedAssessment(assessmentAssignment)
                              }
                            }}
                          >
                            {assessmentAssignment.is_available ? (
                              <>
                                <Play className="h-3 w-3 mr-1" />
                                Start Assessment
                              </>
                            ) : (
                              "Unavailable"
                            )}
                          </Button>
                          {/* <Button size="sm" variant="outline" className="rounded-xl">
                            <FileText className="h-3 w-3 mr-1" />
                            Details
                          </Button> */}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* No Results */}
          {filteredAssessments.length === 0 && (
            <Card className="text-center py-16">
              <CardContent>
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {searchTerm || courseFilter !== "all" || statusFilter !== "all"
                      ? "No assessments match your criteria"
                      : "No assessments available"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm || courseFilter !== "all" || statusFilter !== "all"
                      ? "Try adjusting your search terms or filters to find what you're looking for."
                      : "New assessments will appear here when they become available. Check back regularly or contact your instructor for more information."}
                  </p>
                  {(searchTerm || courseFilter !== "all" || statusFilter !== "all") && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("")
                        setCourseFilter("all")
                        setStatusFilter("all")
                      }}
                      className="rounded-xl"
                    >
                      Clear all filters
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </HeaderLayout>
    
  )
}
