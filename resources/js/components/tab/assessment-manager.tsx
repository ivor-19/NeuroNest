import { useState } from "react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, MoreHorizontal, Search, Edit, Trash2, Users, FileText, AlertCircle, Calendar, Settings, ArrowLeft, UserCheck, Clock, X, Check, HelpCircle } from "lucide-react";
import { Head, useForm, usePage } from "@inertiajs/react";
import type { SharedData } from "@/types";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { 
  InstructorAccessabilityProps,
  AssessmentList,
  AssessmentAssignment,
  Question 
} from "@/types/utils/instructor-accessability-types";

export default function AssessmentManager({ modules, classInstructor, assessments, assignments }: InstructorAccessabilityProps) {
  const { auth } = usePage<SharedData>().props
  const { data, setData, post, processing, errors, reset } = useForm({
    instructor_id: auth.user.id,
    subject_id: classInstructor.subject.id,
    title: "",
    description: "",
  })
  const [activeTab, setActiveTab] = useState("section-assessments")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [questionBuilderOpen, setQuestionBuilderOpen] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentList | null>(null)
  const [assignmentData, setAssignmentData] = useState({ is_available: false, opened_at: "", closed_at: "" })
  const [assignmentSearchTerm, setAssignmentSearchTerm] = useState("")
  const [assignmentSectionFilter, setAssignmentSectionFilter] = useState(
    `${classInstructor.course.code}-${classInstructor.year_level}-${classInstructor.section}`,
  )
  const [assessmentAssignments, setAssessmentAssignments] = useState<AssessmentAssignment[]>(assignments || [])

  // Question builder state
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: "",
    type: "multiple-choice",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    points: 1,
  })
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null)

  const filteredAssessments = assessments.filter(
    (assessment) =>
      assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  const filteredAssignments = assessmentAssignments.filter((assignment) => {
    const assessment = assessments.find((a) => a.id === assignment.assessment_id)
    if (!assessment) return false
    const matchesSearch =
      assignment.course?.name?.toLowerCase().includes(assignmentSearchTerm.toLowerCase()) ||
      assignment.section.toLowerCase().includes(assignmentSearchTerm.toLowerCase()) ||
      assessment.title.toLowerCase().includes(assignmentSearchTerm.toLowerCase()) ||
      assessment.subject.code.toLowerCase().includes(assignmentSearchTerm.toLowerCase())
    const assignmentKey = `${assignment.course?.code || "Unknown"}-${assignment.year_level}-${assignment.section}`
    const matchesSection = assignmentSectionFilter === "all" || assignmentKey === assignmentSectionFilter
    return matchesSearch && matchesSection
  })

  const uniqueSections = [
    ...new Set(
      assessmentAssignments.map((a) => ({
        key: `${a.course?.code || "Unknown"}-${a.year_level}-${a.section}`,
        label: `${a.course?.code || "Unknown"} - ${a.year_level} - ${a.section}`,
      })),
    ),
  ]

  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault()
    post(route("instructor.createAssessment"), {
      ...data,
      onSuccess: (response) => {
        reset()
        // Open question builder modal after successful creation
        setQuestionBuilderOpen(true)
        
         // Get the latest assessment from the updated assessments array
        const assessments = response.props.assessments;
        const latestAssessment = assessments[assessments.length - 1]; // Get the last one (newest)

        console.log(latestAssessment)
        setSelectedAssessment(
          latestAssessment ||  {
            id: Date.now(),
            ...data,
            instructor: auth.user,
            subject: classInstructor.subject,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        )
        setQuestions([])
        toast.success("Assessment created successfully!", {
          description: "You can now add questions to your assessment.",
        })
      },
      onError: (errors) => console.error("Error occurred", errors),
    })
  }

  const handleToggleAvailability = (assignmentId: number, currentStatus: boolean) => {
    const newStatus = !currentStatus
    router.post(
      route("instructor.assessmentAvailability", assignmentId), {},{
        onSuccess: () => console.log(`Toggled assignment ${assignmentId}. New status: ${newStatus}`),
        onError: (errors) => console.error("Error occurred", errors),
      },
    )
    setAssessmentAssignments((prev) =>
      prev.map((assignment) =>
        assignment.id === assignmentId ? { ...assignment, is_available: newStatus } : assignment,
      ),
    )
  }

  const handleAssignToSection = (assessment: AssessmentList) => {
    setSelectedAssessment(assessment)
    setAssignModalOpen(true)
    setAssignmentData({ is_available: false, opened_at: "", closed_at: "" })
  }

  const handleAssignAssessment = async () => {
    if (!selectedAssessment) return
    const newAssignment: AssessmentAssignment = {
      id: Date.now(),
      assessment_id: selectedAssessment.id,
      course_id: classInstructor.course.id,
      course: classInstructor.course,
      year_level: classInstructor.year_level,
      section: classInstructor.section,
      is_available: assignmentData.is_available,
      opened_at: assignmentData.opened_at || undefined,
      closed_at: assignmentData.closed_at || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    console.log(newAssignment)
    setAssessmentAssignments([...assessmentAssignments, newAssignment])
    router.post(route("instructor.assignAssessment"), newAssignment as any, {
      onSuccess: () => {
        setAssignModalOpen(false)
        setSelectedAssessment(null)
        setAssignmentData({ is_available: false, opened_at: "", closed_at: "" })
        toast.success("Assessment has been assigned", {
          description: `New assessment for ${newAssignment.course.code} ${newAssignment.year_level} ${newAssignment.section}`,
          action: { label: "Close", onClick: () => console.log("Close") },
        })
      },
      onError: (errors) => {
        console.error("Assignment failed:", errors)
        toast.error("There has been some problem", {
          description: "There is already an assessment dedicated for this section.",
          action: { label: "Close", onClick: () => console.log("Close") },
        })
      },
    })
  }

  const handleDeleteAssessment = (assessment: AssessmentList) => {
    setSelectedAssessment(assessment)
    setDeleteDialogOpen(true)
  }
  
  const confirmDelete = () => {
    if (selectedAssessment) {
      setDeleteDialogOpen(false)
      setSelectedAssessment(null)
    }
  }
  const getAssignmentForAssessment = (assessmentId: number) =>
    assessmentAssignments.find(
      (assignment) =>
        assignment.assessment_id === assessmentId &&
        assignment.course_id === classInstructor.course.id &&
        assignment.year_level === classInstructor.year_level &&
        assignment.section === classInstructor.section,
    )
  const getAssignedSectionsForAssessment = (assessmentId: number) =>
    assessmentAssignments.filter((assignment) => assignment.assessment_id === assessmentId)

  // Question builder functions
  const resetCurrentQuestion = () => {
    setCurrentQuestion({
      id: "",
      type: "multiple-choice",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "0", // 
      points: 1,
    })
    setEditingQuestionIndex(null)
  }

  const handleQuestionTypeChange = (type: Question["type"]) => {
    const newQuestion = { ...currentQuestion, type }
  
    if (type === "true-false") {
      newQuestion.options = ["True", "False"]
      newQuestion.correctAnswer = "0" 
    } else if (type === "multiple-choice") {
      newQuestion.options = ["", "", "", ""]
      newQuestion.correctAnswer = "0"
    } else {
      // For short-answer and essay questions
      newQuestion.options = undefined
      newQuestion.correctAnswer = undefined 
    }
  
    setCurrentQuestion(newQuestion)
  }

  const handleAddOption = () => {
    if (currentQuestion.options && currentQuestion.options.length < 6) {
      setCurrentQuestion({
        ...currentQuestion,
        options: [...currentQuestion.options, ""],
      })
    }
  }

  const handleRemoveOption = (index: number) => {
    if (currentQuestion.options && currentQuestion.options.length > 2) {
      const newOptions = currentQuestion.options.filter((_, i) => i !== index)
      
      // Better logic for handling correctAnswer when removing options
      let newCorrectAnswer = currentQuestion.correctAnswer
      
      // Convert correctAnswer to string for comparison
      const currentAnswerStr = String(currentQuestion.correctAnswer || "0")
      
      // If we're removing the currently selected answer, reset to first option
      if (currentAnswerStr === index.toString()) {
        newCorrectAnswer = "0"
      } 
      // If the correct answer is after the removed option, decrement its index
      else if (parseInt(currentAnswerStr) > index) {
        newCorrectAnswer = (parseInt(currentAnswerStr) - 1).toString()
      }
      
      setCurrentQuestion({
        ...currentQuestion,
        options: newOptions,
        correctAnswer: newCorrectAnswer,
      })
    }
  }

  const handleOptionChange = (index: number, value: string) => {
    if (currentQuestion.options) {
      const newOptions = [...currentQuestion.options]
      newOptions[index] = value
      setCurrentQuestion({
        ...currentQuestion,
        options: newOptions,
      })
    }
  }

  const handleSaveQuestion = () => {
    if (!currentQuestion.question.trim()) {
      toast.warning("Please enter a question")
      return
    }
  
    // ✅ FIXED: Better validation with proper TypeScript handling
    if (currentQuestion.type === "multiple-choice" || currentQuestion.type === "true-false") {
      // Check if correctAnswer is not set (empty string or undefined)
      if (!currentQuestion.correctAnswer && currentQuestion.correctAnswer !== "0") {
        toast("Please select the correct answer")
        return
      }
      
      // Validate that all options are filled
      if (currentQuestion.options?.some((opt) => !opt.trim())) {
        toast("Please fill in all answer options")
        return
      }
      
      // ✅ FIXED: Proper TypeScript handling for correctAnswer validation
      const correctAnswerStr = String(currentQuestion.correctAnswer) // Convert to string
      const correctIndex = parseInt(correctAnswerStr)
      
      if (isNaN(correctIndex) || correctIndex < 0 || correctIndex >= (currentQuestion.options?.length || 0)) {
        toast("Invalid correct answer selection")
        return
      }
    }
  
    // Debug logging to see what's being saved
    console.log("Saving question:", {
      type: currentQuestion.type,
      question: currentQuestion.question,
      correctAnswer: currentQuestion.correctAnswer,
      options: currentQuestion.options,
      points: currentQuestion.points
    })
  
    const questionToSave = {
      ...currentQuestion,
      id: currentQuestion.id || Date.now().toString(),
    }
  
    if (editingQuestionIndex !== null) {
      const newQuestions = [...questions]
      newQuestions[editingQuestionIndex] = questionToSave
      setQuestions(newQuestions)
      toast("Question updated successfully")
    } else {
      setQuestions([...questions, questionToSave])
      toast("Question added successfully")
    }
  
    resetCurrentQuestion()
  }

  const handleEditQuestion = (index: number) => {
    setCurrentQuestion(questions[index])
    setEditingQuestionIndex(index)
  }

  const handleDeleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
    toast("Question deleted")
  }

  // saving assessment with questions
  const handleSaveAssessment = async () => {
    if (questions.length === 0) {
      toast("Please add at least one question")
      return
    }
  
    try {
      // Debug: Log the original questions data
      console.log("Original questions data:", questions)
      
      // ✅ ADDED: Validate all questions before saving
      const invalidQuestions = questions.filter((question, index) => {
        if ((question.type === "multiple-choice" || question.type === "true-false") 
            && (!question.correctAnswer && question.correctAnswer !== "0")) {
          console.error(`Question ${index + 1} has no correct answer:`, question)
          return true
        }
        return false
      })
      
      if (invalidQuestions.length > 0) {
        toast(`${invalidQuestions.length} question(s) are missing correct answers. Please review and fix them.`)
        return
      }
  
      // Format questions data to match Laravel controller and database expectations
      const formattedQuestions = questions.map((question, index) => {
        const formatted = {
          type: question.type,
          question: question.question,
          points: question.points,
          options: question.options || null,
          correctAnswer: question.correctAnswer || null,
          order: index
        }
        
        // Debug: Log each formatted question
        console.log(`Formatted question ${index + 1}:`, formatted)
        
        return formatted
      })
  
      // Debug: Log the final formatted data
      console.log("Final formatted questions:", formattedQuestions)
  
     
      
      await router.post(route('instructor.saveQuestions', { assessment: selectedAssessment?.id }), { 
        questions: formattedQuestions
      }, {
        onSuccess: () => {
          console.log("Success! Formatted questions were:", formattedQuestions)
          toast("Assessment saved successfully!", {
            description: `${questions.length} questions have been added to your assessment.`,
          })
          setQuestionBuilderOpen(false)
          setQuestions([])
          resetCurrentQuestion()
          setActiveTab("assessment-management")
        },
        onError: (error) => {
          console.error('Error saving assessment:', error)
          console.log("Failed data was:", formattedQuestions)
          toast("Error saving assessment. Please try again.")
        }
      })
      
  
    } catch (error) {
      console.error('Error saving assessment:', error)
      toast("Error saving assessment. Please try again.")
    }
  }

  const getTotalPoints = () => questions.reduce((total, q) => total + q.points, 0)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Head title={"Assessments"} />
      <div className="mx-auto px-4 py-4 max-w-7xl">
        <Card className="shadow-lg">
          <CardContent className="">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="section-assessments">Sections Assessments</TabsTrigger>
                <TabsTrigger value="create-assessment">Create Assessment</TabsTrigger>
                <TabsTrigger value="assessment-management">Assessment Management</TabsTrigger>
              </TabsList>

              <div className="">
                <TabsContent value="assessment-management" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Assessment Management</CardTitle>
                      <CardDescription>Edit assessment details, assign to specific sections, configure questions, or remove assessments as needed</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                          <Input placeholder="Search assessments..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="assigned">Assigned</SelectItem>
                            <SelectItem value="unassigned">Unassigned</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3 overflow-auto h-[26rem] ">
                        {filteredAssessments.map((assessment) => {
                          const assignment = getAssignmentForAssessment(assessment.id)
                          const allAssignments = getAssignedSectionsForAssessment(assessment.id)
                          return (
                            <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4 flex-1">
                                    <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-lg flex items-center justify-center">
                                      <FileText className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <h3 className="font-semibold truncate">{assessment.title}</h3>
                                        <Badge variant="secondary">{assessment.subject.code} - {assessment.subject.title}</Badge>
                                        {assignment ? (
                                          <Badge className={`text-xs ${assignment.is_available ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"}`}>
                                            {assignment.is_available ? "Available" : "Scheduled"}
                                          </Badge>
                                        ) : (
                                          <Badge variant="outline" className="text-xs">Not Assigned</Badge>
                                        )}
                                      </div>
                                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">{assessment.description}</p>
                                      <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                                        {allAssignments.length > 0 && (
                                          <span className="flex items-center gap-1">
                                            <UserCheck className="h-3 w-3" /> Assigned to {allAssignments.length} section{allAssignments.length !== 1 ? "s" : ""}
                                          </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                          <Calendar className="h-3 w-3" /> Created at: {assessment?.created_at ? new Date(assessment.created_at).toLocaleDateString() : "Not available"}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <Calendar className="h-3 w-3" /> Updated at: {assessment?.updated_at ? new Date(assessment.updated_at).toLocaleDateString() : "Not available"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                          <Edit className="h-4 w-4 mr-2" /> Edit Assessment
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAssignToSection(assessment)}>
                                          <Users className="h-4 w-4 mr-2" /> Assign to Section
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => { setSelectedAssessment(assessment); setQuestionBuilderOpen(true); setQuestions([]) }}>
                                          <Settings className="h-4 w-4 mr-2" /> Manage Questions
                                        </DropdownMenuItem>
                                        <Separator />
                                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteAssessment(assessment)}>
                                          <Trash2 className="h-4 w-4 mr-2" /> Delete Assessment
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}

                        {filteredAssessments.length === 0 && (
                          <Card>
                            <CardContent className="py-12">
                              <div className="text-center space-y-4">
                                <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                                  <FileText className="w-8 h-8 text-slate-400" />
                                </div>
                                <div className="space-y-2">
                                  <h3 className="text-lg font-medium">No assessments found</h3>
                                  <p className="text-slate-500 max-w-sm mx-auto">{searchTerm ? "Try adjusting your search terms." : "Get started by creating your first assessment."}</p>
                                </div>
                                {!searchTerm && (
                                  <Button onClick={() => setActiveTab("create-assessment")}>
                                    <Plus className="w-4 h-4 mr-2" /> Create Assessment
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="create-assessment" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Create New Assessment</CardTitle>
                      <CardDescription>Create a new assessment. You can add questions and assign it to students after creation.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Assessment Title</Label>
                        <Input id="title" placeholder="e.g., Midterm Exam, Weekly Quiz #1" value={data.title} onChange={(e) => setData("title", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="Brief description of the assessment..." value={data.description} onChange={(e) => setData("description", e.target.value)} rows={3} />
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div className="text-sm">
                            <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">Next Steps</div>
                            <div className="text-blue-700 dark:text-blue-300">
                              After creating this assessment, you'll be able to:
                              <ul className="list-disc list-inside mt-1 space-y-1">
                                <li>Add questions and answers immediately</li>
                                <li>Configure assessment settings</li>
                                <li>Assign to specific sections</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setActiveTab("section-assessments")}>Cancel</Button>
                        <Button onClick={handleCreateAssessment}  disabled={processing || !data.title || !data.description} className="transition-all">{processing ? "Creating..." : "Create Assessment"}</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="section-assessments" className="space-y-6">
                  <Card className="shadow-sm ">
                    <CardHeader>
                      <CardTitle>Manage Section Assessments</CardTitle>
                      <CardDescription>Manage assessments assigned to different sections and control their availability</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3 overflow-auto max-h-[28rem] ">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="relative flex-1 min-w-0">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                          <Input placeholder="Search assignments by course, section, or assessment..." value={assignmentSearchTerm} onChange={(e) => setAssignmentSearchTerm(e.target.value)} className="pl-10" />
                        </div>
                        <div className="flex gap-2">
                          <Select value={assignmentSectionFilter} onValueChange={setAssignmentSectionFilter}>
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Class Section" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Sections</SelectItem>
                              {Array.from(new Map(assessmentAssignments.map((item) => [`${item.course?.code || item.course?.name}-${item.year_level}-${item.section}`, { key: `${item.course?.code || item.course?.name}-${item.year_level}-${item.section}`, label: `${item.course?.code || item.course?.name} ${item.year_level} - ${item.section}` }])).values()).map((section) => (
                                <SelectItem key={section.key} value={section.key}>{section.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {filteredAssignments.filter((assignment) => assignmentSectionFilter === "all" || `${assignment.course?.code || assignment.course?.name}-${assignment.year_level}-${assignment.section}` === assignmentSectionFilter).map((assignment) => {
                          const assessment = assessments.find((a) => a.id === assignment.assessment_id)
                          if (!assessment) return null
                          return (
                            <Card key={assignment.id} className="group hover:shadow-md transition-all duration-200 border border-slate-200 dark:border-slate-700">
                              <CardContent className="px-6 py-2">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex items-start gap-4 flex-1">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 rounded-xl flex items-center justify-center border border-blue-200 dark:border-blue-700">
                                      <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">{assessment.title}</h3>
                                        <Badge variant="secondary" className="shrink-0 text-xs">{assessment.subject.code}</Badge>
                                      </div>
                                      <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs text-slate-600 dark:text-slate-400">Class:</span>
                                        <Badge variant="outline" className="text-xs font-medium">{assignment.course?.code || assignment.course?.name} {assignment.year_level} - {assignment.section}</Badge>
                                      </div>
                                      <div className="flex items-center gap-6 text-xs text-slate-600 dark:text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                          <Calendar className="h-3.5 w-3.5" /><span>Opens: {assignment.opened_at ? new Date(assignment.opened_at).toLocaleDateString() : "Not assigned"}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          <Clock className="h-3.5 w-3.5" /> <span>Closes: {assignment.closed_at ? new Date(assignment.closed_at).toLocaleDateString() : "Not assigned"}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4 shrink-0">
                                    <div className="flex items-center gap-3">
                                      <div className="text-right">
                                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{assignment.is_available ? "Active" : "Inactive"}</div>
                                        <div className="text-xs text-slate-500">{assignment.is_available ? "Students can access" : "Hidden from students"}</div>
                                      </div>
                                      <Switch checked={assignment.is_available} onCheckedChange={() => { handleToggleAvailability(assignment.id, assignment.is_available) }} className="data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:bg-emerald-500" />
                                    </div>

                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem>
                                          <Users className="h-4 w-4 mr-2" /> View Participants
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                          <Trash2 className="h-4 w-4 mr-2" />Remove Assignment
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}

                        {filteredAssignments.length === 0 && assessmentAssignments.length > 0 && (
                          <div className="text-center py-12">
                            <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                              <Search className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">No assignments found</h3>
                            <p className="text-slate-500 mb-4">Try adjusting your search terms or filters.</p>
                            <Button variant="outline" onClick={() => { setAssignmentSearchTerm(""); setAssignmentSectionFilter("all") }}>Clear Filters</Button>
                          </div>
                        )}

                        {assessmentAssignments.length === 0 && (
                          <div className="text-center py-16">
                            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl flex items-center justify-center mb-6 border border-slate-200 dark:border-slate-600">
                              <Users className="w-10 h-10 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">No assignments yet</h3>
                            <p className="text-slate-500 mb-6 max-w-md mx-auto leading-relaxed">Start by assigning assessments to sections from the Assessment List. You can control when students can access each assignment.</p>
                            <Button onClick={() => setActiveTab("assessment-management")} className="gap-2">
                              <ArrowLeft className="w-4 h-4" />
                              Go to Assessment List
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Question Builder Modal */}
        <Dialog open={questionBuilderOpen}>
          <DialogContent className="min-w-[70%] overflow-y-auto max-h-[90%]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" /> Add Questions to "{selectedAssessment?.title}"
                ID: {selectedAssessment?.id}
              </DialogTitle>
              <DialogDescription> Create questions for your assessment. You can add multiple choice, true/false, short answer, and essay questions.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg"> {editingQuestionIndex !== null ? "Edit Question" : "Add New Question"}</CardTitle>
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
                      <Textarea id="question-text" placeholder="Enter your question here..." value={currentQuestion.question} onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })} rows={3} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="points">Points</Label>
                      <Input id="points"  type="number" min="1" max="100" value={currentQuestion.points} onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: Number.parseInt(e.target.value) || 1 })} />
                    </div>

                    {currentQuestion.type === "multiple-choice" && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Answer Options</Label>
                          <Button type="button" variant="outline" size="sm" onClick={handleAddOption} disabled={currentQuestion.options?.length >= 6} >
                            <Plus className="h-4 w-4 mr-1" /> Add Option
                          </Button>
                        </div>
                        <RadioGroup value={currentQuestion.correctAnswer} onValueChange={(value) => setCurrentQuestion({ ...currentQuestion, correctAnswer: value })} >
                          {currentQuestion.options?.map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                              <Input placeholder={`Option ${index + 1}`} value={option} onChange={(e) => handleOptionChange(index, e.target.value)} className="flex-1" />
                              {currentQuestion.options && currentQuestion.options.length > 2 && (
                                <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveOption(index)} >
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
                        <RadioGroup  value={currentQuestion.correctAnswer} onValueChange={(value) => setCurrentQuestion({ ...currentQuestion, correctAnswer: value })}>
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
                        <Button variant="outline" onClick={resetCurrentQuestion}> Cancel </Button>
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
                          <Button variant="ghost" size="sm" onClick={() => handleEditQuestion(index)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteQuestion(index)}>
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
              <Button variant="outline" onClick={() => setQuestionBuilderOpen(false)}> Save for Later </Button>
              <Button onClick={handleSaveAssessment} disabled={questions.length === 0}>
                <Check className="h-4 w-4 mr-2" /> Complete Assessment ({questions.length} questions)
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ASSIGN SECTION */}
        <Dialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Assign Assessment to Section</DialogTitle>
              <DialogDescription>Configure assignment settings for "{selectedAssessment?.title}"</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-slate-600 to-slate-800 text-white font-bold">
                      {classInstructor.subject.code.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">Assessment Target</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {classInstructor.subject.code} - {classInstructor.year_level} {classInstructor.section}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Course:</span>
                    <div className="font-medium">{classInstructor.course.name}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Year Level:</span>
                    <div className="font-medium">{classInstructor.year_level}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Section:</span>
                    <div className="font-medium">{classInstructor.section}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Availability Settings</h4>
                <div className="flex items-center space-x-2">
                  <Switch id="is_available" checked={assignmentData.is_available} onCheckedChange={(checked) => setAssignmentData({ ...assignmentData, is_available: checked })}/>
                  <Label htmlFor="is_available">Make available immediately</Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="opened_at">Available From (Optional)</Label>
                    <Input id="opened_at" type="datetime-local" value={assignmentData.opened_at} onChange={(e) => setAssignmentData({ ...assignmentData, opened_at: e.target.value })}  />
                    <p className="text-xs text-slate-500">When students can start accessing the assessment</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="closed_at">Available Until (Optional)</Label>
                    <Input id="closed_at" type="datetime-local" value={assignmentData.closed_at} onChange={(e) => setAssignmentData({ ...assignmentData, closed_at: e.target.value })} />
                    <p className="text-xs text-slate-500">Deadline for assessment submission</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">Assignment Details</div>
                    <div className="text-blue-700 dark:text-blue-300">
                      <ul className="list-disc list-inside space-y-1">
                        <li>This assessment will be assigned to the entire section</li>
                        <li>All students in {classInstructor.year_level} {classInstructor.section} will have access</li>
                        <li>You can control availability using the settings above</li>
                        <li>Students will see this assessment in their dashboard when available</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant={"outline"} onClick={() => setAssignModalOpen(false)}> Cancel </Button>
              <Button onClick={handleAssignAssessment}>Assign to Section</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Assessment</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{selectedAssessment?.title}"? This action cannot be undone and will
                remove all associated assignments.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                Delete Assessment
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
