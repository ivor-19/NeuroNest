import { FormEvent, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Trash2, Search, UserCheck, UserIcon, User } from "lucide-react"
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useEffect } from "react"


type UserProps = {
  id: number;
  name: string;
  account_id: string;
}

type StudentProps = {
  id: number;
  student_id: string;
  student_name: string;
  student_email: string;
  contact_number: string;
  student_status: string;
  student_remarks: string;
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

// const students = [
//   {
//     id: 1,
//     studentId: "STU2024001",
//     name: "John Student",
//     email: "john.student@university.edu",
//     course: "BSIS",
//     courseName: "Bachelor of Science in Information Systems",
//     yearLevel: 2,
//     section: "A",
//     academicYear: 2024,
//     status: "active",
//     gpa: 3.75,
//     enrollmentDate: "2024-08-15",
//   },
//   {
//     id: 2,
//     studentId: "STU2024002",
//     name: "Jane Doe",
//     email: "jane.doe@university.edu",
//     course: "BSCS",
//     courseName: "Bachelor of Science in Computer Science",
//     yearLevel: 2,
//     section: "B",
//     academicYear: 2024,
//     status: "active",
//     gpa: 3.5,
//     enrollmentDate: "2024-08-15",
//   },
//   {
//     id: 3,
//     studentId: "STU2024003",
//     name: "Mike Johnson",
//     email: "mike.johnson@university.edu",
//     course: "BSIS",
//     courseName: "Bachelor of Science in Information Systems",
//     yearLevel: 1,
//     section: "A",
//     academicYear: 2024,
//     status: "active",
//     gpa: 3.25,
//     enrollmentDate: "2024-08-15",
//   },
// ]

// const courses = [
//   { code: "BSIS", name: "Bachelor of Science in Information Systems" },
//   { code: "BSCS", name: "Bachelor of Science in Computer Science" },
//   { code: "BSIT", name: "Bachelor of Science in Information Technology" },
// ]

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Students',
        href: 'admin/manageStudents',
    },
];



export default function ManageStudents({ users, students, courses } : ManageStudentsProps) {
  useEffect(() => {
    console.log(users)
  },[])

  const [activeTab, setActiveTab] = useState("view-students")
  const [searchTerm, setSearchTerm] = useState("")
  const { data, setData, post, processing, errors, reset} = useForm({
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
        reset();
      },
      onError: (errors) => {
        console.error('Error occured', errors)
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

  // const getStudentsBySection = (course: string, year: number, section: string) => {
  //   return students.filter((s) => s.course === course && s.yearLevel === year && s.section === section)
  // }
  const filteredStudents = students.filter(student => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      student.student_name.toLowerCase().includes(searchLower) ||
      student.student_id.toLowerCase().includes(searchLower) 
      // student.student_email.toLowerCase().includes(searchLower) ||
      // (student.contact_number && student.contact_number.includes(searchTerm)) ||
      // student.course_code.toLowerCase().includes(searchLower)
    );
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Manage Students" />
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl overflow-x-auto p-8 bg-[var(--bg-main)]">
        <div>
        <h1 className="text-3xl font-bold tracking-tight">Students & Sections</h1>
        <p className="text-muted-foreground">
          Manage student enrollments and assign them to course sections. Students must be assigned to sections to access
          subjects.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="view-students">All Students</TabsTrigger>
          <TabsTrigger value="assign-sections">Assign to Sections</TabsTrigger>
          <TabsTrigger value="by-sections">View by Sections</TabsTrigger>
        </TabsList>

        <TabsContent value="view-students" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Students</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search students..."  className="pl-8 w-64" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                  </div>
                  <Button onClick={() => setActiveTab("assign-sections")}>
                    <UserCheck className="h-4 w-4 mr-2" /> Assign Sections
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="" alt={student.student_name} />
                          <AvatarFallback>{getInitials(student.student_name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{student.student_name}</p>
                            <Badge variant="outline">{student.student_id}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {student.student_email} 
                            {student.contact_number && <span> • {student.contact_number}</span>}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <span>{student.course_code}</span>
                            {student.section ? (
                              <>
                                <span>Year {student.year_level}</span>
                                <span>Section {student.section}</span>
                                <span>AY {student.academic_year}</span>
                              </>
                            ) : (
                              <span>Not assigned to a section</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={student.student_status === "active" ? "default" : "secondary"}> {student.student_status} </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground"> {searchTerm ? "No students match your search" : "No students found"} </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assign-sections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assign Student to Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student">Select Student</Label>
                  <Select value={data.student_id} onValueChange={(value) => setData("student_id", value)} >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name} 
                          <span className="text-muted-foreground">
                            ({user.account_id})
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {errors.student_id && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.student_id.includes('already') 
                      ? 'This student is already assigned to a section'
                      : errors.student_id.includes('required')
                      ? 'Please select a student'
                      : errors.student_id
                    }
                  </p>
                )}
                <div className="space-y-2">
                  <Label htmlFor="course">Course Program</Label>
                  <Select value={data.course_id} onValueChange={(value) => setData("course_id", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={String(course.id)}>
                          {course.code} - {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {errors.course_id && (
                  <p className="text-sm font-medium text-destructive">Please select a course</p>
                )}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yearLevel">Year Level</Label>
                    <Select value={data.year_level} onValueChange={(value) => setData("year_level", value)} >
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
                    {errors.year_level && (
                      <p className="text-sm font-medium text-destructive">{errors.year_level}</p>
                    )}
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
                    {errors.section && (
                      <p className="text-sm font-medium text-destructive">{errors.section}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="academicYear">Academic Year</Label>
                    <Select value={data.academic_year} onValueChange={(value) => setData("academic_year", value)} >
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2026">2026</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.academic_year && (
                      <p className="text-sm font-medium text-destructive">{errors.academic_year}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleAssignSection}>Assign to Section</Button>
                  <Button variant="outline" onClick={() => setActiveTab("view-students")}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-sections" className="space-y-4">
          <div className="space-y-6">
            {/* {courses.map((course) => (
              <Card key={course.code}>
                <CardHeader>
                  <CardTitle>
                    {course.code} - {course.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((year) => (
                      <div key={year} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-3">Year {year}</h4>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                          {["A", "B", "C", "D"].map((section) => {
                            const sectionStudents = getStudentsBySection(course.code, year, section)
                            return (
                              <div key={section} className="bg-gray-50 p-3 rounded">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-medium">Section {section}</h5>
                                  <Badge variant="outline">{sectionStudents.length} students</Badge>
                                </div>
                                <div className="space-y-1">
                                  {sectionStudents.map((student) => (
                                    <div key={student.id} className="text-xs p-1 bg-white rounded">
                                      {student.name}
                                    </div>
                                  ))}
                                  {sectionStudents.length === 0 && (
                                    <p className="text-xs text-muted-foreground">No students assigned</p>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))} */}
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </AppLayout>
  );
}
