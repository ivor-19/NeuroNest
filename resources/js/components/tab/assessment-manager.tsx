"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Plus, MoreHorizontal, Search, Edit, Trash2, Users, FileText, CheckCircle, AlertCircle, Calendar, Settings, ArrowLeft } from "lucide-react"

// interface AssessmentAssignment { id: number; assessment_id: number; course_id: number; year_level: string; section: string; is_available: boolean; opened_at?: string; closed_at?: string; created_at: string; updated_at: string; assessment: AssessmentList }
interface ClassInstructor { 
  id: number; 
  course: {
    id: number;
    name: string;
  }; 
  subject: {
    id: number; 
    code: string; 
    title: string; 
    description: string; 
    year_level: string; 
    semester: string; 
    isActive: boolean 
  }; 
  year_level: string; 
  section: string 
}

interface ModuleAccess { 
  id: number; 
  module_id: number; 
  class_instructor_id: number; 
  is_available: boolean; 
  module: {
    id: number; 
    subject_id: 
    number; title:
    string; description: 
    string; status: "published" | "draft"; 
    order: number; materials?: 
    any; pdf?: string | null 
  }
}

interface AssessmentList {
  id: number;
  title: string;
  description: string;
  instructor: {
    id: number;
    name: string;
  }
  subject: {
    id: number;
    code: string;
    title: string;
  }

  instructor_id: number;
  subject_id: number;
}

interface Props { 
  classInstructor: ClassInstructor; 
  modules: ModuleAccess[] 
  assessments: AssessmentList[]
}


export default function AssessmentManager({ modules, classInstructor, assessments }: Props) {
  const [activeTab, setActiveTab] = useState("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentList | null>(null)
  const instructorId = 1

  // Mock data
  // const [assessments, setAssessments] = useState<Assessment[]>([
  //   { id: 1, instructor_id: 1, title: "Midterm Examination", description: "Comprehensive exam covering chapters 1-5", created_at: "2024-02-01T00:00:00Z", updated_at: "2024-02-01T00:00:00Z" },
  //   { id: 2, instructor_id: 1, title: "Weekly Quiz #3", description: "Quiz on data structures and algorithms", created_at: "2024-02-10T00:00:00Z", updated_at: "2024-02-10T00:00:00Z" }
  // ])

  // const [assessmentAssignments, setAssessmentAssignments] = useState<AssessmentAssignment[]>([
  //   { id: 1, assessment_id: 1, course_id: classInstructor.course.id, year_level: classInstructor.year_level, section: classInstructor.section, is_available: true, opened_at: "2024-03-01T08:00:00Z", closed_at: "2024-03-15T23:59:59Z", created_at: "2024-02-01T00:00:00Z", updated_at: "2024-02-01T00:00:00Z", assessment: assessments[0] }
  // ])

  const [newAssessment, setNewAssessment] = useState({ title: "", description: "" })
  const [newAssignment, setNewAssignment] = useState({ assessment_id: "", is_available: false, opened_at: "", closed_at: "" })

  const filteredAssessments = assessments.filter(assessment => 
    assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    assessment.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // const handleCreateAssessment = () => {
  //   const assessment: Assessment = {
  //     id: Date.now(), instructor_id: instructorId, title: newAssessment.title, description: newAssessment.description,
  //     created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  //   }
  //   setAssessments([assessment, ...assessments])
  //   setNewAssessment({ title: "", description: "" })
  //   setActiveTab("list")
  // }

  // const handleDeleteAssessment = (assessment: Assessment) => {
  //   setSelectedAssessment(assessment)
  //   setDeleteDialogOpen(true)
  // }

  // const confirmDelete = () => {
  //   if (selectedAssessment) {
  //     setAssessments(assessments.filter(a => a.id !== selectedAssessment.id))
  //     setDeleteDialogOpen(false)
  //     setSelectedAssessment(null)
  //   }
  // }

  // const currentSectionAssignments = assessmentAssignments.filter(assignment => 
  //   assignment.course_id === classInstructor.course.id && 
  //   assignment.year_level === classInstructor.year_level && 
  //   assignment.section === classInstructor.section
  // )

  // const handleToggleAvailability = (assignmentId: number, isCurrentlyAvailable: boolean) => {
  //   setAssessmentAssignments(prev => prev.map(assignment => 
  //     assignment.id === assignmentId ? { ...assignment, is_available: !isCurrentlyAvailable } : assignment
  //   ))
  // }

  // const handleDeleteAssignment = (assignment: AssessmentAssignment) => {
  //   setAssessmentAssignments(prev => prev.filter(a => a.id !== assignment.id))
  // }

  // const handleAssignToSection = () => {
  //   const selectedAssessment = assessments.find(a => a.id === Number.parseInt(newAssignment.assessment_id))
  //   if (!selectedAssessment) return

  //   const assignment: AssessmentAssignment = {
  //     id: Date.now(), assessment_id: Number.parseInt(newAssignment.assessment_id), course_id: classInstructor.course.id,
  //     year_level: classInstructor.year_level, section: classInstructor.section, is_available: newAssignment.is_available,
  //     opened_at: newAssignment.opened_at || undefined, closed_at: newAssignment.closed_at || undefined,
  //     created_at: new Date().toISOString(), updated_at: new Date().toISOString(), assessment: selectedAssessment
  //   }

  //   setAssessmentAssignments([assignment, ...assessmentAssignments])
  //   setNewAssignment({ assessment_id: "", is_available: false, opened_at: "", closed_at: "" })
  //   setActiveTab("list")
  // }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className=" mx-auto px-4 py-4 max-w-7xl">
        <Card className="shadow-lg">
          <CardContent className="">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="list">Assessment List</TabsTrigger>
                <TabsTrigger value="create">Create Assessment</TabsTrigger>
                <TabsTrigger value="assign">Assign to Section</TabsTrigger>
              </TabsList>

              {/* Scrollable Tab Content */}
              <div className=" ">
                <TabsContent value="list" className="space-y-6">
                  <div className="flex items-center gap-4 ">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input placeholder="Search assessments..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="unavailable">Unavailable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    {assessments.map(assessment => (
                       <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-lg flex items-center justify-center">
                                <FileText className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <h3 className="font-semibold truncate">{assessment.title}</h3>
                                  <Badge variant="secondary">
                                    {assessment.subject.code} - {assessment.subject.title}
                                  </Badge>
                                  <Badge
                                    className={`text-xs`}
                                  >
                                    Available
                                  </Badge>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">{assessment.description}</p>
                                <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Opens: 
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Closes: 
                                  </span>
                                </div>
                              </div>
                            </div>
                  
                            <div className="flex items-center gap-4">
                              {/* <Switch checked={assignment.is_available} onCheckedChange={() => handleToggleAvailability(assignment.id, assignment.is_available)} /> */}
                              <Switch  />
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />Edit Assignment</DropdownMenuItem>
                                  <DropdownMenuItem><Settings className="h-4 w-4 mr-2" />Manage Questions</DropdownMenuItem>
                                  <Separator />
                                  <DropdownMenuItem className="text-red-600" >
                                    <Trash2 className="h-4 w-4 mr-2" />Remove Assignment
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </CardContent>
                     </Card>
                    ))}

                    {assessments.length === 0 && (
                      <Card>
                        <CardContent className="py-12">
                          <div className="text-center space-y-4">
                            <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                              <FileText className="w-8 h-8 text-slate-400" />
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-lg font-medium">No assessments assigned</h3>
                              <p className="text-slate-500 max-w-sm mx-auto">Get started by creating your first assessment and assigning it to this section.</p>
                            </div>
                            <Button onClick={() => setActiveTab("create")}><Plus className="w-4 h-4 mr-2" />Create Assessment</Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="create" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Create New Assessment</CardTitle>
                      <CardDescription>Create a new assessment. You can add questions and assign it to students after creation.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Assessment Title</Label>
                        <Input id="title" placeholder="e.g., Midterm Exam, Weekly Quiz #1" value={newAssessment.title} onChange={e => setNewAssessment({ ...newAssessment, title: e.target.value })} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="Brief description of the assessment..." value={newAssessment.description} onChange={e => setNewAssessment({ ...newAssessment, description: e.target.value })} rows={3} />
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div className="text-sm">
                            <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">Next Steps</div>
                            <div className="text-blue-700 dark:text-blue-300">
                              After creating this assessment, you'll be able to:
                              <ul className="list-disc list-inside mt-1 space-y-1">
                                <li>Add questions and answers</li>
                                <li>Configure assessment settings</li>
                                <li>Assign to specific sections</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setActiveTab("list")}>Cancel</Button>
                        <Button  disabled={!newAssessment.title.trim() || !newAssessment.description.trim()}>Create Assessment</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="assign" className="space-y-4">
                  <Card className="overflow-y-auto h-[550px]">
                    <CardHeader>
                      <CardTitle>Assign Assessment to Section</CardTitle>
                      <CardDescription>Select an assessment and assign it to this section. All students in the section will have access.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="assessment-select">Select Assessment to Assign</Label>
                        <Select value={newAssignment.assessment_id} onValueChange={value => setNewAssignment({ ...newAssignment, assessment_id: value })}>
                          <SelectTrigger id="assessment-select" className="w-full">
                            <SelectValue placeholder="Choose an assessment to assign">
                              {newAssignment.assessment_id && (
                                <div className="flex items-center gap-2 truncate">
                                  <span className="font-medium truncate">
                                    {assessments.find(a => a.id.toString() === newAssignment.assessment_id)?.title}
                                  </span>
                                  <span className="text-xs text-slate-500 shrink-0">
                                    ({assessments.find(a => a.id.toString() === newAssignment.assessment_id)?.subject.code})
                                  </span>
                                </div>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {assessments.map(assessment => (
                              <SelectItem key={assessment.id} value={assessment.id.toString()}className="py-3">
                                <div className="flex flex-col gap-1 w-full">
                                  <span className="font-medium text-sm leading-tight">{assessment.title}</span>
                                  <span className="text-xs text-slate-500 leading-tight">{assessment.subject.code} - {assessment.subject.title}</span>
                                  {assessment.description && (
                                    <span className="text-xs text-slate-400 leading-tight line-clamp-2">{assessment.description}</span>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {/* Uncomment if you want to show when all assessments are assigned */}
                        {/* {assessments.filter(assessment => 
                          !currentSectionAssignments.some(assignment => 
                            assignment.assessment_id === assessment.id
                          )
                        ).length === 0 && (
                          <p className="text-sm text-slate-500 italic">
                            All available assessments have been assigned to this section.
                          </p>
                        )} */}
                      </div>

                      <Separator />

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
                          <div><span className="text-slate-500">Course:</span><div className="font-medium">{classInstructor.course.name}</div></div>
                          <div><span className="text-slate-500">Year Level:</span><div className="font-medium">{classInstructor.year_level}</div></div>
                          <div><span className="text-slate-500">Section:</span><div className="font-medium">{classInstructor.section}</div></div>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Users className="h-4 w-4" /><span>All students in this section will have access to this assessment</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium">Availability Settings</h4>
                        <div className="flex items-center space-x-2">
                          <Switch id="is_available" checked={newAssignment.is_available} onCheckedChange={checked => setNewAssignment({ ...newAssignment, is_available: checked })} />
                          <Label htmlFor="is_available">Make available immediately</Label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="opened_at">Available From (Optional)</Label>
                            <Input id="opened_at" type="datetime-local" value={newAssignment.opened_at} onChange={e => setNewAssignment({ ...newAssignment, opened_at: e.target.value })} />
                            <p className="text-xs text-slate-500">When students can start accessing the assessment</p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="closed_at">Available Until (Optional)</Label>
                            <Input id="closed_at" type="datetime-local" value={newAssignment.closed_at} onChange={e => setNewAssignment({ ...newAssignment, closed_at: e.target.value })} />
                            <p className="text-xs text-slate-500">Deadline for assessment submission</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div className="text-sm">
                            <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">Assessment Details</div>
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

                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setActiveTab("list")}>Cancel</Button>
                        {/* <Button disabled={!newAssignment.assessment_id} onClick={handleAssignToSection}>Assign to Section</Button> */}
                        <Button>Assign to Section</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Assessment</AlertDialogTitle>
              <AlertDialogDescription>Are you sure you want to delete "{selectedAssessment?.title}"? This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction  className="bg-red-600 hover:bg-red-700">Delete Assessment</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}