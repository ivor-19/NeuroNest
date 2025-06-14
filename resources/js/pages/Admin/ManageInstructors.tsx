import { FormEvent, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Trash2, Search, UserCheck, Plus, MapPin, Clock, GraduationCap, BookOpen, Users, Calendar } from "lucide-react"
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useEffect } from "react"


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
  const [assignmentForm, setAssignmentForm] = useState({
    instructorId: '',
    courseId: '',
    subjectId: '',
    yearLevel: '',
    section: ''
  });

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

  const handleAssignInstructor = () => {
    console.log("Assigning instructor:", assignmentForm)
   
    setActiveTab("assign-instructor")
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
    setAssignmentForm(prev => ({
      ...prev,
      courseId: courseId,
      subjectId: '' // Clear subject when course changes
    }));
  };

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setAssignmentForm(prev => ({
      ...prev,
      subjectId: subjectId
    }));
  };


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Manage Instructors" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl overflow-x-auto p-8 bg-[var(--bg-main)]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Instructors & Assignments</h1>
        <p className="text-muted-foreground">Manage instructor accounts, assignments, and teaching schedules.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="view-instructors">All Instructors</TabsTrigger>
          <TabsTrigger value="assign-instructor">Assign Instructor</TabsTrigger>
          <TabsTrigger value="by-instructor">By Instructor</TabsTrigger>
        </TabsList>

        {/* VIEW ALL INSTRUCTORS TAB */}
        <TabsContent value="view-instructors" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Instructors</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search instructors..." className="pl-8 w-64" />
                  </div>
                  <Button onClick={() => setActiveTab("add-instructor")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Instructor
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {instructors.map((instructor) => {
                  return (
                    <div key={instructor.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="" alt={instructor.name} />
                          <AvatarFallback>{getInitials(instructor.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{instructor.name}</p>
                            <Badge variant="outline">{instructor.account_id}</Badge>
                            {/* <Badge variant="secondary">{instructor.position}</Badge> */}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {instructor.email} 
                            {instructor.contact_number && <span> • {instructor.contact_number}</span>}
                          </p>
                          {/* <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <span>{instructor.department}</span>
                            <span>{instructor.experienceYears} years exp.</span>
                            <span>{instructorAssignments.length} assignments</span>
                          </div> */}
                          {/* <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {instructor.officeLocation}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {instructor.officeHours}
                            </span>
                          </div> */}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={instructor.status === "active" ? "default" : "secondary"}>
                          {instructor.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
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
                    value={assignmentForm.instructorId}
                    onValueChange={(value) => setAssignmentForm({ ...assignmentForm, instructorId: value })}
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
                    value={selectedCourse}
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
                    value={selectedSubject}
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
                      value={assignmentForm.yearLevel}
                      onValueChange={(value) => setAssignmentForm({ ...assignmentForm, yearLevel: value })}
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
                      value={assignmentForm.section}
                      onValueChange={(value) => setAssignmentForm({ ...assignmentForm, section: value })}
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

                <div className="flex gap-2">
                  <Button onClick={handleAssignInstructor}>Assign Instructor</Button>
                  <Button variant="outline" onClick={() => setActiveTab("view-assignments")}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BY INSTRUCTOR TAB */}
        <TabsContent value="by-instructor" className="space-y-6 transition-colors">
        <Card className="border-[var--(zinc)] shadow-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div>
                <CardTitle className="text-xl">Teaching Assignments</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Manage instructor assignments and course sections</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {instructors.map((instructor) => (
              <div key={instructor.id} className="group">
                <Card className="border border-muted hover:border-muted-300 transition-colors">
                  <CardContent className="p-6">
                    {/* Instructor Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 ring-2 ring-muted">
                          <AvatarImage src="" alt={instructor.name} />
                          <AvatarFallback className=" font-semibold bg-[var(--zinc)]">
                            {getInitials(instructor.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg ">{instructor.name}</h3>
                          {/* <p className="text-sm text-gray-600 mb-1">{instructor.department}</p> */}
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              <span>{instructor.teaching_assignments?.length || 0} courses</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>
                                {/* {instructor.teaching_assignments?.reduce(
                                  (sum, assignment) => sum + (assignment.student_count || 0),
                                  0,
                                ) || 0}{" "} */}
                                0
                                students
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={instructor.teaching_assignments?.length > 0 ? "default" : "secondary"}
                        className="px-3 py-1"
                      >
                        {instructor.teaching_assignments?.length || 0} assignments
                      </Badge>
                    </div>

                    {/* Assignments Grid */}
                    {instructor.teaching_assignments?.length > 0 ? (
                      <div className="grid gap-3">
                        {instructor.teaching_assignments.map((assignment) => (
                          <div
                            key={assignment.id}
                            className="flex items-center justify-between p-4 rounded-lg border border-muted bg-[var(--zinc)] transition-all group/assignment"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="font-mono text-xs px-2 py-1 bg-background">
                                    {assignment.course_code}
                                  </Badge>
                                  <span className="text-sm font-medium ">
                                    Year {assignment.year_level} • Section {assignment.section}
                                  </span>
                                </div>
                                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                                  {assignment.subject_code}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-4 text-xs text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>Semester {assignment.subject_semester}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  <span>0 students</span>
                                </div>
                                {assignment.subject_title && (
                                  <span className="text-gray-500">• {assignment.subject_title}</span>
                                )}
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover/assignment:opacity-100 transition-opacity"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <BookOpen className="h-8 w-8 text-gray-400" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2">No assignments yet</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          This instructor hasn't been assigned to any courses this semester.
                        </p>
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => setActiveTab("assign-instructor")}>
                          <Users className="h-4 w-4" />
                          Assign Sections
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      </Tabs>
    </div>
         
    </AppLayout>
  );
}
