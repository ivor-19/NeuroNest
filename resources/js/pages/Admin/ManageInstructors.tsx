import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Plus,
  BookOpen,
  Users,
  Calendar,
  UserPlus,
  Mail,
  Phone,
  UserRoundX,
  ChevronDown,
  ChevronUp,
  Eye,
} from "lucide-react"
import AppLayout from "@/layouts/app-layout"
import type { SharedData, BreadcrumbItem } from "@/types"
import { Head, router, useForm, usePage } from "@inertiajs/react"
import { useEffect } from "react"
import { toast } from "sonner"
import DeleteModal from "@/components/modal/delete-modal"

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Manage Instructors",
    href: "admin/manageInstructors",
  },
]

type Subject = {
  id: number
  code: string
  title: string
}

type CourseData = {
  course_id: string
  course_code: string
  course_name: string
  subjects: Subject[]
}

type InstructorProps = {
  instructors: {
    id: number
    name: string
    email: string
    account_id?: string
    contact_number?: string
    remarks?: string
    status?: string
    teaching_assignments: {
      id: number
      course_code: string
      course_name: string
      subject_code: string
      subject_title: string
      subject_semester: string
      year_level: string
      section: string
    }[]
  }[]
  courseSubjects: Record<string, CourseData>
}

export default function ManageInstructors({ instructors, courseSubjects }: InstructorProps) {
  const { auth } = usePage<SharedData>().props
  const [activeTab, setActiveTab] = useState("view-instructors")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInstructorForAssignment, setSelectedInstructorForAssignment] = useState<number | null>(null)
  const [expandedInstructors, setExpandedInstructors] = useState<Set<number>>(new Set())

  // Add these new state variables for assignment filters
  const [assignmentSearchQuery, setAssignmentSearchQuery] = useState("")
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("all")
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>("all")
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>("all")
  const [assignmentCountFilter, setAssignmentCountFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, setData, post, processing, errors, reset } = useForm({
    instructor_id: "",
    course_id: "",
    subject_id: "",
    year_level: "",
    section: "",
  })

  useEffect(() => {
    console.log(instructors)
  }, [])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const toggleExpanded = (instructorId: number) => {
    const newExpanded = new Set(expandedInstructors)
    if (newExpanded.has(instructorId)) {
      newExpanded.delete(instructorId)
    } else {
      newExpanded.add(instructorId)
    }
    setExpandedInstructors(newExpanded)
  }

  const [alreadyAssigned, setAlreadyAssigned] = useState(false)

  const handleAssignInstructor = () => {
    console.log("Assigning instructor:", data)
    post(route("admin.assignInstructor"), {
      onSuccess: () => {
        router.post(
          route("admin.addActivity"),
          {
            type: "assign",
            user: auth.user.name,
            action: `Assign instructor`,
            details: ``,
          },
          {},
        )
        reset()
        toast("Assigned successfully")
        setAlreadyAssigned(false)
      },
      onError: (errors) => {
        console.error(errors)
        const hasAssignmentError = Object.values(errors).some((error) =>
          error.includes("There is already an instructor assigned"),
        )

        setAlreadyAssigned(hasAssignmentError)
      },
    })
  }

  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [selectedSubject, setSelectedSubject] = useState<string>("")

  const availableCourses = useMemo(() => {
    return Object.values(courseSubjects).map((courseData) => ({
      id: courseData.course_id,
      code: courseData.course_code,
      name: courseData.course_name,
    }))
  }, [courseSubjects])

  const availableSubjects = useMemo(() => {
    if (!selectedCourse) return []
    return courseSubjects[selectedCourse]?.subjects || []
  }, [selectedCourse, courseSubjects])

  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId)
    setSelectedSubject("")
    setData({
      ...data,
      course_id: courseId,
      subject_id: "",
    })
  }

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId)
    setData({
      ...data,
      subject_id: subjectId,
    })
  }

  const filteredInstructors = instructors.filter(
    (instructor) =>
      instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instructor.account_id?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter logic for assignments tab
  const filteredInstructorsForAssignments = useMemo(() => {
    return instructors.filter((instructor) => {
      // Search filter
      const matchesSearch =
        instructor.name.toLowerCase().includes(assignmentSearchQuery.toLowerCase()) ||
        instructor.email.toLowerCase().includes(assignmentSearchQuery.toLowerCase()) ||
        instructor.account_id?.toLowerCase().includes(assignmentSearchQuery.toLowerCase())

      // Status filter
      const matchesStatus = statusFilter === "all" || instructor.status === statusFilter

      // Assignment count filter
      const assignmentCount = instructor.teaching_assignments?.length || 0
      const matchesAssignmentCount =
        assignmentCountFilter === "all" ||
        (assignmentCountFilter === "none" && assignmentCount === 0) ||
        (assignmentCountFilter === "few" && assignmentCount > 0 && assignmentCount <= 3) ||
        (assignmentCountFilter === "many" && assignmentCount > 3)

      // Course filter
      const matchesCourse =
        selectedCourseFilter === "all" ||
        instructor.teaching_assignments?.some((assignment) => assignment.course_code === selectedCourseFilter)

      // Subject filter
      const matchesSubject =
        selectedSubjectFilter === "all" ||
        instructor.teaching_assignments?.some((assignment) => assignment.subject_code === selectedSubjectFilter)

      // Year level filter
      const matchesYear =
        selectedYearFilter === "all" ||
        instructor.teaching_assignments?.some((assignment) => assignment.year_level === selectedYearFilter)

      return matchesSearch && matchesStatus && matchesAssignmentCount && matchesCourse && matchesSubject && matchesYear
    })
  }, [
    instructors,
    assignmentSearchQuery,
    selectedCourseFilter,
    selectedSubjectFilter,
    selectedYearFilter,
    assignmentCountFilter,
    statusFilter,
  ])

  // Get unique values for filter options
  const uniqueCourses = useMemo(() => {
    const courses = new Set<string>()
    instructors.forEach((instructor) => {
      instructor.teaching_assignments?.forEach((assignment) => {
        courses.add(assignment.course_code)
      })
    })
    return Array.from(courses).sort()
  }, [instructors])

  const uniqueSubjects = useMemo(() => {
    const subjects = new Set<string>()
    instructors.forEach((instructor) => {
      instructor.teaching_assignments?.forEach((assignment) => {
        subjects.add(assignment.subject_code)
      })
    })
    return Array.from(subjects).sort()
  }, [instructors])

  const clearAllFilters = () => {
    setAssignmentSearchQuery("")
    setSelectedCourseFilter("all")
    setSelectedSubjectFilter("all")
    setSelectedYearFilter("all")
    setAssignmentCountFilter("all")
    setStatusFilter("all")
  }

  const handleQuickAssign = (instructorId: number) => {
    setSelectedInstructorForAssignment(instructorId)
    setData((prev) => ({ ...prev, instructor_id: instructorId.toString() }))
    setActiveTab("assign-instructor")
  }

  const [deleteId, setDeleteId] = useState(0)
  const [deleteUnassignedOpen, setDeleteUnassignedOpen] = useState(false)

  const handleUnassigned = async (id: number) => {
    setDeleteUnassignedOpen(true)
    setDeleteId(id)
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Manage Instructors" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl overflow-x-auto p-8 bg-[var(--bg-main)]">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Instructors & Assignments</h1>
          <p className="text-muted-foreground">Manage instructor accounts, assignments, and teaching schedules.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="view-instructors" className="flex items-center gap-2 cursor-pointer">
              <Users className="h-4 w-4" />
              All Instructors
            </TabsTrigger>
            <TabsTrigger value="assign-instructor" className="flex items-center gap-2 cursor-pointer">
              <UserPlus className="h-4 w-4" />
              Assign
            </TabsTrigger>
            <TabsTrigger value="by-instructor" className="flex items-center gap-2 cursor-pointer">
              <BookOpen className="h-4 w-4" />
              Assignments
            </TabsTrigger>
          </TabsList>

          {/* VIEW ALL INSTRUCTORS TAB */}
          <TabsContent value="view-instructors" className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      All Instructors
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {filteredInstructors.length} instructor{filteredInstructors.length !== 1 ? "s" : ""} found
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search instructors..."
                        className="pl-9 w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredInstructors.map((instructor) => (
                    <Card
                      key={instructor.id}
                      className="group hover:shadow-md transition-all duration-200 border-2 hover:border-primary/20"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                          {/* Avatar and Status */}
                          <div className="relative">
                            <Avatar className="h-16 w-16 ring-2 ring-border group-hover:ring-primary/30 transition-all">
                              <AvatarImage src="/placeholder.svg" alt={instructor.name} />
                              <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/20 font-semibold text-lg">
                                {getInitials(instructor.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1">
                              <Badge
                                variant={instructor.status === "active" ? "default" : "secondary"}
                                className="text-xs px-2 py-0.5 rounded-full"
                              >
                                {instructor.status}
                              </Badge>
                            </div>
                          </div>

                          {/* Name and ID */}
                          <div className="space-y-1">
                            <h3 className="font-semibold text-lg leading-tight">{instructor.name}</h3>
                            <Badge variant="outline" className="font-mono text-xs">
                              {instructor.account_id}
                            </Badge>
                          </div>

                          {/* Contact Info */}
                          <div className="space-y-2 w-full">
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{instructor.email}</span>
                            </div>
                            {instructor.contact_number && (
                              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <Phone className="h-3 w-3 flex-shrink-0" />
                                <span>{instructor.contact_number}</span>
                              </div>
                            )}
                          </div>

                          {/* Stats */}
                          <div className="flex items-center justify-center gap-4 w-full pt-2 border-t">
                            <div className="text-center">
                              <div className="font-semibold text-lg text-primary">
                                {instructor.teaching_assignments?.length || 0}
                              </div>
                              <div className="text-xs text-muted-foreground">Assignments</div>
                            </div>
                            <div className="h-8 w-px bg-border"></div>
                            <div className="text-center">
                              <div className="font-semibold text-lg text-green-600">
                                {instructor.status === "active" ? "Active" : "Inactive"}
                              </div>
                              <div className="text-xs text-muted-foreground">Status</div>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex gap-2 w-full pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 gap-2 bg-transparent"
                              onClick={() => handleQuickAssign(instructor.id)}
                            >
                              <Plus className="h-3 w-3" />
                              Assign
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-2">
                              <Eye className="h-3 w-3" />
                              View
                            </Button>
                          </div>

                          {/* Assignments Preview */}
                          {instructor.teaching_assignments && instructor.teaching_assignments.length > 0 && (
                            <div className="w-full pt-2 border-t">
                              <div className="text-xs text-muted-foreground mb-2">Recent Assignments</div>
                              <div className="space-y-1">
                                {instructor.teaching_assignments.slice(0, 2).map((assignment) => (
                                  <div
                                    key={assignment.id}
                                    className="flex items-center justify-between text-xs bg-muted/50 rounded px-2 py-1"
                                  >
                                    <span className="font-medium">{assignment.subject_code}</span>
                                    <span className="text-muted-foreground">
                                      Y{assignment.year_level}-{assignment.section}
                                    </span>
                                  </div>
                                ))}
                                {instructor.teaching_assignments.length > 2 && (
                                  <div className="text-xs text-muted-foreground text-center pt-1">
                                    +{instructor.teaching_assignments.length - 2} more
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredInstructors.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-lg mb-2">No instructors found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? "Try adjusting your search terms" : "Get started by adding your first instructor"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ASSIGN INSTRUCTOR TAB */}
          <TabsContent value="assign-instructor" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Assign Instructor to Section</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="instructor">Select Instructor</Label>
                    <Select value={data.instructor_id} onValueChange={(value) => setData("instructor_id", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an instructor" />
                      </SelectTrigger>
                      <SelectContent>
                        {instructors.map((instructor) => (
                          <SelectItem key={instructor.id} value={instructor.id.toString()}>
                            {instructor.name} <Badge variant={"secondary"}>{instructor.account_id}</Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="course">Course Program</Label>
                    <Select value={data.course_id} onValueChange={handleCourseChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCourses.map((course) => (
                          <SelectItem key={course.id} value={course.id.toString()}>
                            {course.code} - {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select value={data.subject_id} onValueChange={handleSubjectChange} disabled={!selectedCourse}>
                      <SelectTrigger>
                        <SelectValue placeholder={selectedCourse ? "Choose a subject" : "Select a course first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSubjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id.toString()}>
                            {subject.code} - {subject.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="yearLevel">Year Level</Label>
                      <Select value={data.year_level} onValueChange={(value) => setData("year_level", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st Year</SelectItem>
                          <SelectItem value="2">2nd Year</SelectItem>
                          <SelectItem value="3">3rd Year</SelectItem>
                          <SelectItem value="4">4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="section">Section</Label>
                      <Select value={data.section} onValueChange={(value) => setData("section", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Section" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">Section A</SelectItem>
                          <SelectItem value="B">Section B</SelectItem>
                          <SelectItem value="C">Section C</SelectItem>
                          <SelectItem value="D">Section D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2 h-full items-center">
                    <Button onClick={handleAssignInstructor}>Assign Instructor</Button>
                    <Button variant="outline" onClick={() => setActiveTab("view-instructors")}>
                      Cancel
                    </Button>
                    {alreadyAssigned && (
                      <p className="text-destructive text-xs">
                        There is already an instructor assigned for this section.
                      </p>
                    )}
                    {(errors.course_id ||
                      errors.instructor_id ||
                      errors.year_level ||
                      errors.section ||
                      errors.subject_id) && <p className="text-xs text-destructive">Complete all fields</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* BY INSTRUCTOR TAB  */}
          <TabsContent value="by-instructor" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Teaching Assignments Overview
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      View and manage all instructor assignments by instructor
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>
                      {filteredInstructorsForAssignments.length} instructor
                      {filteredInstructorsForAssignments.length !== 1 ? "s" : ""} shown
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search and Filters */}
                <div className="space-y-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search instructors by name, email, or ID..."
                      className="pl-9"
                      value={assignmentSearchQuery}
                      onChange={(e) => setAssignmentSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Filters */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Status</Label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Assignments</Label>
                      <Select value={assignmentCountFilter} onValueChange={setAssignmentCountFilter}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Counts</SelectItem>
                          <SelectItem value="none">No Assignments</SelectItem>
                          <SelectItem value="few">1-3 Assignments</SelectItem>
                          <SelectItem value="many">4+ Assignments</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Course</Label>
                      <Select value={selectedCourseFilter} onValueChange={setSelectedCourseFilter}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
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

                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Subject</Label>
                      <Select value={selectedSubjectFilter} onValueChange={setSelectedSubjectFilter}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Subjects</SelectItem>
                          {uniqueSubjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Year Level</Label>
                      <Select value={selectedYearFilter} onValueChange={setSelectedYearFilter}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Years</SelectItem>
                          <SelectItem value="1">1st Year</SelectItem>
                          <SelectItem value="2">2nd Year</SelectItem>
                          <SelectItem value="3">3rd Year</SelectItem>
                          <SelectItem value="4">4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Actions</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAllFilters}
                        className="h-8 w-full text-xs bg-transparent"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>

                  {/* Active Filters Display */}
                  {(assignmentSearchQuery ||
                    statusFilter !== "all" ||
                    assignmentCountFilter !== "all" ||
                    selectedCourseFilter !== "all" ||
                    selectedSubjectFilter !== "all" ||
                    selectedYearFilter !== "all") && (
                    <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg">
                      <span className="text-xs text-muted-foreground">Active filters:</span>
                      {assignmentSearchQuery && (
                        <Badge variant="secondary" className="text-xs">
                          Search: "{assignmentSearchQuery}"
                        </Badge>
                      )}
                      {statusFilter !== "all" && (
                        <Badge variant="secondary" className="text-xs">
                          Status: {statusFilter}
                        </Badge>
                      )}
                      {assignmentCountFilter !== "all" && (
                        <Badge variant="secondary" className="text-xs">
                          Count: {assignmentCountFilter}
                        </Badge>
                      )}
                      {selectedCourseFilter !== "all" && (
                        <Badge variant="secondary" className="text-xs">
                          Course: {selectedCourseFilter}
                        </Badge>
                      )}
                      {selectedSubjectFilter !== "all" && (
                        <Badge variant="secondary" className="text-xs">
                          Subject: {selectedSubjectFilter}
                        </Badge>
                      )}
                      {selectedYearFilter !== "all" && (
                        <Badge variant="secondary" className="text-xs">
                          Year: {selectedYearFilter}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Instructors List */}
                <div className="space-y-6">
                  {filteredInstructorsForAssignments.map((instructor) => {
                    const isExpanded = expandedInstructors.has(instructor.id)
                    const assignments = instructor.teaching_assignments || []
                    const visibleAssignments = isExpanded ? assignments : assignments.slice(0, 2)
                    const hasMoreAssignments = assignments.length > 2

                    return (
                      <Card key={instructor.id} className="border border-border">
                        <CardContent className="p-6">
                          {/* Instructor Header */}
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-14 w-14 ring-2 ring-border">
                                <AvatarImage src="/placeholder.svg" alt={instructor.name} />
                                <AvatarFallback className="bg-muted font-semibold">
                                  {getInitials(instructor.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-lg mb-1">{instructor.name}</h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                  <div className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    <span>{instructor.email}</span>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {instructor.account_id}
                                  </Badge>
                                  <Badge
                                    variant={instructor.status === "active" ? "default" : "secondary"}
                                    className="text-xs"
                                  >
                                    {instructor.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <BookOpen className="h-3 w-3" />
                                    <span>{assignments.length} courses</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    <span>Active assignments</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={assignments.length > 0 ? "default" : "secondary"} className="px-3 py-1">
                                {assignments.length} assignments
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuickAssign(instructor.id)}
                                className="gap-2"
                              >
                                <Plus className="h-4 w-4" />
                                Assign
                              </Button>
                            </div>
                          </div>

                          {/* Assignments */}
                          {assignments.length > 0 ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm text-muted-foreground">Current Assignments</h4>
                                {hasMoreAssignments && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleExpanded(instructor.id)}
                                    className="gap-2 text-xs"
                                  >
                                    {isExpanded ? (
                                      <>
                                        <ChevronUp className="h-3 w-3" />
                                        Show Less
                                      </>
                                    ) : (
                                      <>
                                        <ChevronDown className="h-3 w-3" />
                                        View More ({assignments.length - 2})
                                      </>
                                    )}
                                  </Button>
                                )}
                              </div>
                              <div className="grid gap-3">
                                {visibleAssignments.map((assignment) => (
                                  <div
                                    key={assignment.id}
                                    className="flex items-center justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                                  >
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-2">
                                        <Badge variant="outline" className="font-mono text-xs bg-background">
                                          {assignment.course_code}
                                        </Badge>
                                        <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                                          {assignment.subject_code}
                                        </Badge>
                                        <span className="text-sm font-medium">
                                          Year {assignment.year_level} • Section {assignment.section}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                          <Calendar className="h-3 w-3" />
                                          <span>Semester {assignment.subject_semester}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <BookOpen className="h-3 w-3" />
                                          <span>{assignment.subject_title}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="gap-2 text-amber-600 text-xs cursor-pointer"
                                      onClick={() => handleUnassigned(assignment.id)}
                                    >
                                      <UserRoundX className="h-4 w-4" />
                                      Unassigned
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="h-8 w-8 text-muted-foreground" />
                              </div>
                              <h4 className="font-medium mb-2">No assignments yet</h4>
                              <p className="text-sm text-muted-foreground mb-4">
                                This instructor hasn't been assigned to any courses this semester.
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 bg-transparent"
                                onClick={() => handleQuickAssign(instructor.id)}
                              >
                                <UserPlus className="h-4 w-4" />
                                Assign Courses
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* No Results */}
                {filteredInstructorsForAssignments.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-lg mb-2">No instructors found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search terms or filters to find what you're looking for.
                    </p>
                    <Button variant="outline" onClick={clearAllFilters} className="gap-2 bg-transparent">
                      <Search className="h-4 w-4" />
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <DeleteModal 
          open={deleteUnassignedOpen}
          onOpenChange={setDeleteUnassignedOpen}
          id={deleteId}
          title="Remove Instructor"
          routeLink={'admin.unassignedInstructor'}
          description={"This will permanently revoke the instructor’s assignment to this section"}
          toastMessage="Unassigned successfully"
          buttonTitle="Confirm"
          type='remove'
          additionalInfo={[
            "Instructor will be unlinked from this section",
            "You can re-link the instrucotr to this section later if needed"
          ]}
        />
      </div>
    </AppLayout>
  )
}
