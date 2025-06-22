import { FormEvent, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Trash2, Search, UserCheck, Plus, MapPin, Clock, GraduationCap, BookOpen, Users, Calendar, UserPlus, Mail, Phone, Trash, UserRoundX } from "lucide-react"
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useEffect } from "react"
import DeleteModal from "@/components/modal/delete-modal"


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Instructors',
        href: 'admin/manageInstructors',
    },
];

type Subject = {
  id: number;
  code: string;
  title: string;
}

type CourseData = {
  course_id: string;
  course_code: string;
  course_name: string;
  subjects: Subject[];
}

type InstructorProps = {
  instructors: {
    id: number;
    name: string;
    email: string;
    account_id?: string;
    contact_number?: string;
    remarks?: string;
    status?: string;
    teaching_assignments: {
      id: number;
      course_code: string;
      course_name: string;
      subject_code: string;
      subject_title: string;
      subject_semester: string;
      year_level: string;
      section: string;
    }[];
  }[];
  courseSubjects: Record<string, CourseData>; // Changed to CourseData
}

export default function ManageInstructors({ instructors, courseSubjects  } : InstructorProps) {
  const [activeTab, setActiveTab] = useState("view-instructors")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInstructorForAssignment, setSelectedInstructorForAssignment] = useState<number | null>(null)
  const { data, setData, post, processing, errors, reset} = useForm({
    instructor_id: '',
    course_id: '',
    subject_id: '',
    year_level: '',
    section: ''
  })

  useEffect(() => {
    console.log(instructors)
  },[])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const [alreadyAssigned, setAlreadyAssigned] = useState(false);
  const handleAssignInstructor = () => {
    console.log("Assigning instructor:", data)
    post(route('admin.assignInstructor'), {
      onSuccess: () => {
        reset()
        setAlreadyAssigned(false)
      },
      onError: (errors) => {
        console.error(errors)

        const hasAssignmentError = Object.values(errors).some(error => 
          error.includes('There is already an instructor assigned')
        );
        
        setAlreadyAssigned(hasAssignmentError);  
      }
    })
    
  }

  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  const availableCourses = useMemo(() => {
    return Object.values(courseSubjects).map(courseData => ({
      id: courseData.course_id,
      code: courseData.course_code,
      name: courseData.course_name
    }));
  }, [courseSubjects]);
  
  const availableSubjects = useMemo(() => {
    if (!selectedCourse) return [];
    return courseSubjects[selectedCourse]?.subjects || [];
  }, [selectedCourse, courseSubjects]);

  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    setSelectedSubject(''); // Reset subject when course changes
    setData({
      ...data,
      course_id: courseId,  // Update form data
      subject_id: ''        // Clear subject when course changes
    });
  };
  
  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setData({
      ...data,
      subject_id: subjectId
    });
  };

  const filteredInstructors = instructors.filter(
    (instructor) =>
      instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instructor.account_id?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
          <TabsTrigger value="view-instructors" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            All Instructors
          </TabsTrigger>
          <TabsTrigger value="assign-instructor" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Assign
          </TabsTrigger>
          <TabsTrigger value="by-instructor" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Assignments
          </TabsTrigger>
        </TabsList>

        {/* VIEW ALL INSTRUCTORS TAB */}
        <TabsContent value="view-instructors" className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  All Instructors
                </CardTitle>
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
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Instructor
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredInstructors.map((instructor) => (
                <Card key={instructor.id} className="border border-border hover:border-border/80 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="h-12 w-12 ring-2 ring-border">
                          <AvatarImage src="" alt={instructor.name} />
                          <AvatarFallback className="bg-muted font-semibold">
                            {getInitials(instructor.name)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{instructor.name}</h3>
                            <Badge variant="outline" className="font-mono text-xs">
                              {instructor.account_id}
                            </Badge>
                            <Badge
                              variant={instructor.status === "active" ? "default" : "secondary"}
                              className="capitalize"
                            >
                              {instructor.status}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                <span>{instructor.email}</span>
                              </div>
                              {instructor.contact_number && (
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  <span>{instructor.contact_number}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                <span>{instructor.teaching_assignments?.length || 0} assignments</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>Active this semester</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredInstructors.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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
                  <Select
                    value={data.instructor_id}
                    onValueChange={(value) => setData("instructor_id", value)}
                  >
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
                  <Select
                    value={data.course_id}
                    onValueChange={handleCourseChange}
                  >
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
                  <Select
                    value={data.subject_id}
                    onValueChange={handleSubjectChange}
                    disabled={!selectedCourse}
                  >
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
                    <Select
                      value={data.year_level}
                      onValueChange={(value) => setData("year_level", value)}
                    >
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
                    <Select
                      value={data.section}
                      onValueChange={(value) => setData("section", value)}
                    >
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
                  <Button variant="outline" onClick={() => setActiveTab("view-assignments")}>
                    Cancel
                  </Button>
                  {alreadyAssigned && (
                    <p className="text-destructive text-xs">There is already an instructor assigned for this section.</p>
                  )}
                  {(errors.course_id || errors.instructor_id || errors.year_level || errors.section || errors.subject_id) && (
                    <p className="text-xs text-destructive">Complete all fields</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BY INSTRUCTOR TAB */}
        <TabsContent value="by-instructor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Teaching Assignments Overview
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                View and manage all instructor assignments by instructor
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {instructors.map((instructor) => (
                <Card key={instructor.id} className="border border-border">
                  <CardContent className="p-6">
                    {/* Instructor Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 ring-2 ring-border">
                          <AvatarImage src="" alt={instructor.name} />
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
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              <span>{instructor.teaching_assignments?.length || 0} courses</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>Active assignments</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={instructor.teaching_assignments?.length > 0 ? "default" : "secondary"}
                          className="px-3 py-1"
                        >
                          {instructor.teaching_assignments?.length || 0} assignments
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
                    {instructor.teaching_assignments?.length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm text-muted-foreground mb-3">Current Assignments</h4>
                        <div className="grid gap-3">
                          {instructor.teaching_assignments.map((assignment) => (
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

                              <Button variant="ghost" size="sm" className="gap-2 text-destructive text-xs cursor-pointer" onClick={() =>handleUnassigned(assignment.id)}>
                                <UserRoundX className="h-4 w-4"/>
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
                          className="gap-2"
                          onClick={() => handleQuickAssign(instructor.id)}
                        >
                          <UserPlus className="h-4 w-4" />
                          Assign Courses
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
      <DeleteModal 
        open={deleteUnassignedOpen}
        onOpenChange={setDeleteUnassignedOpen}
        id={deleteId}
        routeLink={'admin.unassignedInstructor'}
        description={"This will permanently revoke the instructor’s assignment to this section"}
        toastMessage="Unassigned successfully"
        buttonTitle="Confirm"
      />
    </div>
         
    </AppLayout>
  );
}
