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
import { Plus, MoreHorizontal, Search, Edit, Trash2, Users, FileText, AlertCircle, Calendar, Settings, ArrowLeft, UserCheck, Clock, X, Check, HelpCircle, Menu, CheckCircle, BookOpen } from "lucide-react";
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
import HeaderLayout from "@/layouts/header-layout";
import { Progress } from "@/components/ui/progress";
import { AssessmentManagementTab } from "@/components/tab/assessment-management";
import { CreateAssessmentTab } from "@/components/tab/create-assessment";
import { QuestionBuilderModal } from "@/components/modal/question-builder";

export default function Assessments({ classInstructor, assessments, assignments }: InstructorAccessabilityProps) {
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
  const [sidebarOpen, setSidebarOpen] = useState(true)
   const [questions, setQuestions] = useState<Question[]>([])

  const availableAssessments = assignments.filter((a) => a.is_available).length
  const totalAssessments = assignments.length

  const getProgressData = () => ({
    current: availableAssessments,
    total: totalAssessments,
    label: "Assessment Progress",
    description: "assessments available"
  });

  const progressData = getProgressData()
  
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
  return (
    <HeaderLayout>
      <Head title="Assessments"/>
      <div className="min-h-[calc(100vh-4rem)] mt-16">
        <div className="flex h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-900">
          <div className={`${sidebarOpen ? "w-80" : "w-16"} transition-all duration-300 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shadow-sm`}>
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"><Menu className="h-4 w-4" /></Button>
              </div>
            </div>
            {sidebarOpen && (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-slate-200 dark:border-slate-600">
                    <AvatarFallback className="bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-300 dark:to-slate-100 text-white dark:text-slate-900 font-bold">{classInstructor.subject.code.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-slate-900 dark:text-slate-100 truncate">{classInstructor.subject.code}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{classInstructor.subject.title}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                    <div className="text-slate-500 dark:text-slate-400 text-xs">Year Level</div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{classInstructor.year_level}</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                    <div className="text-slate-500 dark:text-slate-400 text-xs">Section</div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{classInstructor.section}</div>
                  </div>
                </div>
                <Separator className="bg-slate-200 dark:bg-slate-700" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{progressData.label}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{progressData.current}/{progressData.total}</span>
                  </div>
                  <Progress value={(progressData.current / progressData.total) * 100} className="h-2" />
                  <div className="text-xs text-slate-500 dark:text-slate-400">{Math.round((progressData.current / progressData.total) * 100)}% {progressData.description}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className={`${progressData.current != 0 ? 'bg-emerald-50 dark:bg-emerald-900/20': 'bg-slate-50 dark:bg-slate-700/50'} p-3 rounded-lg`}>
                    <div className={`flex items-center gap-2 ${progressData.current != 0 ? 'text-emerald-600 dark:text-emerald-400': 'text-slate-600 dark:text-slate-400'}`}>
                      <CheckCircle className={`h-4 w-4`} />
                      <div>
                        <div className={`text-xs`}>{"Active"}</div>
                        <div className="font-bold ">{progressData.current}</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                       <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      <div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Total</div>
                        <div className="font-bold text-slate-700 dark:text-slate-300">{progressData.total}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <Separator className="bg-slate-200 dark:bg-slate-700" />
                <nav className="space-y-1">
                  <Button 
                      variant={"ghost"} 
                      className="w-full justify-start" 
                      size="sm" 
                      onClick={() => router.visit(route('instructor.modules', {
                          course_id: classInstructor.course.id,
                          year_level: classInstructor.year_level,
                          section: classInstructor.section,
                          subject_id: classInstructor.subject.id
                      }))}
                  >
                      <BookOpen className="h-4 w-4 mr-2" />Modules
                  </Button>
                  <Button variant={"default"} className="w-full justify-start" size="sm" onClick={() => console.log(assessments)}>
                    <FileText className="h-4 w-4 mr-2" />Assessments
                  </Button>
                </nav>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{"Assessments"}</h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">{"Create and manage assessments for your course"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs border-slate-300 dark:border-slate-600"><Calendar className="h-3 w-3 mr-1" />{classInstructor.subject.semester}</Badge>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
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
                     
                      <TabsContent value="create-assessment" className="space-y-6">
                        <CreateAssessmentTab
                          classInstructor={classInstructor}
                          setActiveTab={setActiveTab}
                          setQuestionBuilderOpen={setQuestionBuilderOpen}
                          setSelectedAssessment={setSelectedAssessment}
                          setQuestions={setQuestions}
                        />
                      </TabsContent>
                     
                      <TabsContent value="assessment-management">
                        <AssessmentManagementTab
                          classInstructor={classInstructor}
                          assessments={assessments}
                          assignments={assignments}
                          assessmentAssignments={assessmentAssignments}
                          setAssessmentAssignments={setAssessmentAssignments}
                        />
                      </TabsContent>      
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {/* Question Builder Modal */}
      <QuestionBuilderModal
        open={questionBuilderOpen}
        onOpenChange={setQuestionBuilderOpen}
        selectedAssessment={selectedAssessment}
        questions={questions}
        setQuestions={setQuestions}
        onComplete={() => {
          setQuestionBuilderOpen(false);
          setQuestions([]);
          setActiveTab("assessment-management");
        }}
      />
      </div>
    </HeaderLayout>
  )
}