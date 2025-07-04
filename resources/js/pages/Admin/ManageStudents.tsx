import { FormEvent, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Edit, Trash2, Search, UserCheck, User, Filter, Download, Plus, MoreHorizontal, Users, GraduationCap, Building2, Calendar, IdCard, Mail, Book, UserPlus, UserRoundX } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect } from "react"
import { toast } from "sonner"
import DeleteModal from "@/components/modal/delete-modal"

type UserProps = {
  id: number;
  name: string;
  account_id: string;
}

type StudentProps = {
  user_id: number;
  student_id: string;
  student_name: string;
  student_email: string;
  contact_number: string;
  student_status: string;
  student_remarks: string;
  profile_id: number;
  course_id: number;
  course_code: string;
  year_level: number;
  section: string;
  academic_year: string;
}

type CourseProps = {
  id: number;
  code: string;
  name: string;
  isActive: number;
}

type ManageStudentsProps = {
  users: UserProps[];
  students: StudentProps[];
  courses: CourseProps[];
};

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Student Management',
    href: 'admin/manageStudents',
  },
];

export default function ManageStudents({ users, students, courses }: ManageStudentsProps) {
  const { auth } = usePage<SharedData>().props
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [courseFilter, setCourseFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const [sectionFilter, setSectionFilter] = useState("all")
 
  const { data, setData, post, processing, errors, reset } = useForm({
    student_id: '',
    course_id: '',
    year_level: '',
    section: '',
    academic_year: '',
  })


  const handleAssignSection = async (e: React.FormEvent) => {
    e.preventDefault()
    post(route('admin.assignStudent'), {
      onSuccess: () => {
        router.post(route("admin.addActivity"), {
          type: "assign",
          user: auth.user.name,
          action: `Assign section`,
          details: `${data.year_level} - ${data.section}`
        }, {})
        reset();
      },
      onError: (errors) => {
        console.error('Error occurred', errors)
      }
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Enhanced filtering logic
  const filteredStudents = students.filter(student => {
    const matchesSearch = !searchTerm || 
      student.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || student.student_status === statusFilter;
    
    // Safely handle null/undefined course_id
    const matchesCourse = courseFilter === "all" || 
      (student.course_id != null && student.course_id.toString() === courseFilter);
    
    // Safely handle null/undefined year_level
    const matchesYear = yearFilter === "all" || 
      (student.year_level != null && student.year_level.toString() === yearFilter);
    
    // Safely handle null/undefined section
    const matchesSection = sectionFilter === "all" || 
      (student.section != null && student.section === sectionFilter);
  
    return matchesSearch && matchesStatus && matchesCourse && matchesYear && matchesSection;
  });

  const [deleteId, setDeleteId] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const handleRemoveFromSection = async (id : number) => {
    setDeleteDialogOpen(true)
    setDeleteId(id)

  }

  // Statistics calculations
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.student_status === 'active').length;
  const assignedStudents = students.filter(s => s.section).length;
  const unassignedStudents = totalStudents - assignedStudents;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Student Management System" />
      <div className="flex h-full flex-1 flex-col gap-6 p-8 bg-[var(--bg-main)]">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Student Management System</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive student enrollment and section management platform
            </p>
          </div>
          {/* <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div> */}
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">{totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Students</p>
                  <p className="text-2xl font-bold">{activeStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assigned to Sections</p>
                  <p className="text-2xl font-bold">{assignedStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <User className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Unassigned</p>
                  <p className="text-2xl font-bold">{unassignedStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">

           <TabsList className="grid w-full grid-cols-4 lg:max-w-[60%]">
            <TabsTrigger value="overview" className="text-sm cursor-pointer">Student Directory</TabsTrigger>
            <TabsTrigger value="assignments" className="text-sm cursor-pointer">Assign Sections</TabsTrigger>
            <TabsTrigger value="sections" className="text-sm cursor-pointer">Section Overview</TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm cursor-pointer">Analytics</TabsTrigger>
          </TabsList>

          {/* Student Directory Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Student Directory
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Manage and view all registered students
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>
                      {filteredStudents.length} student
                      {filteredStudents.length !== 1 ? "s" : ""} shown
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
                      placeholder="Search by name, ID, or email..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Filters */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Status</Label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-8 cursor-pointer">
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
                      <Label className="text-xs text-muted-foreground">Course</Label>
                      <Select value={courseFilter} onValueChange={setCourseFilter}>
                        <SelectTrigger className="h-8 cursor-pointer">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Courses</SelectItem>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id.toString()}>
                              {course.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Year</Label>
                      <Select value={yearFilter} onValueChange={setYearFilter}>
                        <SelectTrigger className="h-8 cursor-pointer">
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
                      <Label className="text-xs text-muted-foreground">Section</Label>
                      <Select value={sectionFilter} onValueChange={setSectionFilter}>
                        <SelectTrigger className="h-8 cursor-pointer">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Sections</SelectItem>
                          <SelectItem value="A">Section A</SelectItem>
                          <SelectItem value="B">Section B</SelectItem>
                          <SelectItem value="C">Section C</SelectItem>
                          <SelectItem value="D">Section D</SelectItem>
                          <SelectItem value="E">Section E</SelectItem>
                          <SelectItem value="F">Section F</SelectItem>
                          <SelectItem value="G">Section G</SelectItem>
                          <SelectItem value="H">Section H</SelectItem>
                          <SelectItem value="I">Section I</SelectItem>
                          <SelectItem value="J">Section J</SelectItem>
                          <SelectItem value="K">Section K</SelectItem>
                          <SelectItem value="L">Section L</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Actions</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchTerm("");
                          setStatusFilter("all");
                          setCourseFilter("all");
                          setYearFilter("all");
                          setSectionFilter("all");
                        }}
                        className="h-8 w-full text-xs bg-transparent cursor-pointer"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>

                  {/* Active Filters Display */}
                  {(searchTerm ||
                    statusFilter !== "all" ||
                    courseFilter !== "all" ||
                    yearFilter !== "all" ||
                    sectionFilter !== "all") && (
                    <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg">
                      <span className="text-xs text-muted-foreground">Active filters:</span>
                      {searchTerm && (
                        <Badge variant="secondary" className="text-xs">
                          Search: "{searchTerm}"
                        </Badge>
                      )}
                      {statusFilter !== "all" && (
                        <Badge variant="secondary" className="text-xs">
                          Status: {statusFilter}
                        </Badge>
                      )}
                      {courseFilter !== "all" && (
                        <Badge variant="secondary" className="text-xs">
                          Course: {courses.find(c => c.id.toString() === courseFilter)?.code}
                        </Badge>
                      )}
                      {yearFilter !== "all" && (
                        <Badge variant="secondary" className="text-xs">
                          Year: {yearFilter}
                        </Badge>
                      )}
                      {sectionFilter !== "all" && (
                        <Badge variant="secondary" className="text-xs">
                          Section: {sectionFilter}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Students Table */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Student Information</TableHead>
                        <TableHead>Course Program</TableHead>
                        <TableHead>Academic Details</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-12">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student, index) => (
                          <TableRow key={student.user_id} className="hover:bg-muted/50">
                            <TableCell className="font-medium text-muted-foreground">
                              {index + 1}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src="" alt={student.student_name} />
                                  <AvatarFallback className="text-xs">
                                    {getInitials(student.student_name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{student.student_name}</p>
                                  <p className="text-sm text-muted-foreground">{student.student_id}</p>
                                  <p className="text-xs text-muted-foreground">{student.student_email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{student.course_code}</p>
                                <p className="text-sm text-muted-foreground">
                                  {courses.find(c => c.id === student.course_id)?.name}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {student.section ? (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      Year {student.year_level}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      Section {student.section}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    AY {student.academic_year}
                                  </p>
                                </div>
                              ) : (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 px-2 text-xs cursor-pointer" 
                                  onClick={() => {
                                    if (student.user_id) {
                                      setActiveTab("assignments");
                                      setData("student_id", student.user_id.toString());
                                    } else {
                                      toast.error("This student doesn't have a valid profile ID");
                                      console.log(student.user_id)
                                    }
                                  }}
                                >
                                  <Badge> Not Assigned </Badge>
                                </Button>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={student.student_status === "active" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {student.student_status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="cursor-pointer">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  {!student.section && 
                                  
                                    <DropdownMenuItem
                                      className="cursor-pointer"
                                      onClick={() => {
                                        if (student.user_id) {
                                          setActiveTab("assignments");
                                          setData("student_id", student.user_id.toString());
                                        } else {
                                          toast.error("This student doesn't have a valid profile ID");
                                          console.log(student.user_id)
                                        }
                                      }}
                                    >
                                      <UserCheck className="h-4 w-4 mr-2" />
                                      Assign Section
                                    </DropdownMenuItem>
                                  }
                                  {student.section && 
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="text-destructive cursor-pointer" onClick={() => handleRemoveFromSection(student.profile_id)}>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Remove from section
                                      </DropdownMenuItem>
                                    </>
                                  }
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <div className="flex flex-col items-center gap-2">
                              <Users className="h-8 w-8 text-muted-foreground" />
                              <p className="text-muted-foreground">
                                {searchTerm || statusFilter !== "all" || courseFilter !== "all" 
                                  ? "No students match the current filters" 
                                  : "No students found"}
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Section Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Assign Sections Center</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Assign students to their respective course sections and academic years
                </p>
                {data.student_id && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="w-fit">
                      Assigning section for: {users.find(u => u.id.toString() === data.student_id)?.name || "Unknown Student"}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setData("student_id", "")}
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="student" className="text-sm font-medium">Select Student</Label>
                      <Select value={data.student_id} onValueChange={(value) => setData("student_id", value)}>
                        <SelectTrigger className="h-11 cursor-pointer">
                          <SelectValue placeholder="Choose a student to assign" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                              <div className="flex items-center gap-2">
                                <span>{user.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {user.account_id}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.student_id && (
                        <p className="text-sm text-destructive">{errors.student_id}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="course" className="text-sm font-medium">Course Program</Label>
                      <Select value={data.course_id} onValueChange={(value) => setData("course_id", value)}>
                        <SelectTrigger className="h-11 cursor-pointer">
                          <SelectValue placeholder="Select course program" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={String(course.id)}>
                              <div>
                                <p className="font-medium">{course.code}</p>
                                <p className="text-xs text-muted-foreground">{course.name}</p>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.course_id && (
                        <p className="text-sm text-destructive">{errors.course_id}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="yearLevel" className="text-sm font-medium">Year Level</Label>
                        <Select value={data.year_level} onValueChange={(value) => setData("year_level", value)}>
                          <SelectTrigger className="h-11 cursor-pointer">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1st Year</SelectItem>
                            <SelectItem value="2">2nd Year</SelectItem>
                            <SelectItem value="3">3rd Year</SelectItem>
                            <SelectItem value="4">4th Year</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.year_level && (
                          <p className="text-sm text-destructive">{errors.year_level}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="section" className="text-sm font-medium">Section</Label>
                        <Select value={data.section} onValueChange={(value) => setData("section", value)}>
                          <SelectTrigger className="h-11 cursor-pointer">
                            <SelectValue placeholder="Section" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">Section A</SelectItem>
                            <SelectItem value="B">Section B</SelectItem>
                            <SelectItem value="C">Section C</SelectItem>
                            <SelectItem value="D">Section D</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.section && (
                          <p className="text-sm text-destructive">{errors.section}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="academicYear" className="text-sm font-medium">Academic Year</Label>
                        <Select value={data.academic_year} onValueChange={(value) => setData("academic_year", value)}>
                          <SelectTrigger className="h-11 cursor-pointer">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2025">2025</SelectItem>
                            <SelectItem value="2026">2026</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.academic_year && (
                          <p className="text-sm text-destructive">{errors.academic_year}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleAssignSection} disabled={processing} className="flex-1">
                        {processing ? "Assigning..." : "Assign to Section"}
                      </Button>
                      <Button variant="outline" onClick={() => reset()}>
                        Clear Form
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Section Overview Tab */}
          <TabsContent value="sections" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Section Distribution Overview</CardTitle>
                <p className="text-sm text-muted-foreground">
                  View student enrollment across all course programs and sections
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {courses.map((course) => {
                    const courseStudents = students.filter(student => student.course_id === course.id);
                    
                    return (
                      <div key={course.id} className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <GraduationCap className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{course.code} - {course.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {courseStudents.length} total students enrolled
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">{courseStudents.length} students</Badge>
                        </div>

                        {courseStudents.length > 0 ? (
                          <div className="grid gap-4">
                            {[1, 2, 3, 4].map((year) => {
                              const yearStudents = courseStudents.filter(student => student.year_level === year);
                              if (yearStudents.length === 0) return null;

                              return (
                                <div key={year} className="border rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium flex items-center gap-2">
                                      <Calendar className="h-4 w-4" />
                                      Year {year}
                                    </h4>
                                    <Badge variant="secondary">{yearStudents.length} students</Badge>
                                  </div>
                                  
                                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                                    {["A", "B", "C", "D"].map((section) => {
                                      const sectionStudents = yearStudents.filter(student => student.section === section);
                                      
                                      return (
                                        <div key={section} className="border rounded-lg p-3 bg-card">
                                          <div className="flex items-center justify-between mb-3">
                                            <h5 className="font-medium text-sm">Section {section}</h5>
                                            <Badge variant="outline" className="text-xs">
                                              {sectionStudents.length}
                                            </Badge>
                                          </div>
                                          
                                          <div className="space-y-2 max-h-32 overflow-y-auto">
                                            {sectionStudents.length > 0 ? (
                                              sectionStudents.map((student) => (
                                                <div key={student.user_id} className="flex items-center gap-2 p-2 bg-muted/50 rounded text-xs">
                                                  <Avatar className="h-6 w-6">
                                                    <AvatarFallback className="text-xs">
                                                      {getInitials(student.student_name)}
                                                    </AvatarFallback>
                                                  </Avatar>
                                                  <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate">{student.student_name}</p>
                                                    <p className="text-muted-foreground">{student.student_id}</p>
                                                  </div>
                                                </div>
                                              ))
                                            ) : (
                                              <div className="text-center py-4">
                                                <p className="text-xs text-muted-foreground">No students assigned</p>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8 border rounded-lg border-dashed">
                            <User className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No students enrolled in this program</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Enrollment Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Enrollment</span>
                      <span className="font-semibold">{totalStudents}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Students</span>
                      <span className="font-semibold text-green-600">{activeStudents}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Section Assignment Rate</span>
                      <span className="font-semibold">
                        {totalStudents > 0 ? Math.round((assignedStudents / totalStudents) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Course Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {courses.map((course) => {
                      const courseCount = students.filter(s => s.course_id === course.id).length;
                      const percentage = totalStudents > 0 ? (courseCount / totalStudents) * 100 : 0;
                      
                      return (
                        <div key={course.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{course.code}</span>
                            <span>{courseCount} students</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        <DeleteModal 
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          id={deleteId}
          title='Remove Student'
          routeLink={'admin.removeFromSection'}
          description={"This will permanently remove the student to this section"}
          toastMessage="Removal complete"
          buttonTitle="Confirm"
          type='remove'
          additionalInfo={[
            `Student will be remove from this section`,
            "You can re-add the student to this section later if needed"
          ]}
        />

      </div>
    </AppLayout>
  );
}