import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Trash2, Mail, MailCheck, Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect } from "react"

type StudentProps = {
  students: {
    id: number;
    student_id: number;
    student_name: string;
    student_email: string;
    course_id: number;
    course_code: string;
    year_level: number;
    section: string;
    academic_year: string;
  }[];
}

const sampleStudents = [
  {
    id: 1,
    studentId: "STU2024001",
    name: "John Student",
    email: "john.student@university.edu",
    program: "BSIS",
    yearLevel: 2,
    section: "A",
    gpa: 3.75,
    status: "active",
    emailVerified: true,
    enrollmentDate: "2024-08-15",
  },
  {
    id: 2,
    studentId: "STU2024002",
    name: "Jane Doe",
    email: "jane.doe@university.edu",
    program: "BSCS",
    yearLevel: 2,
    section: "B",
    gpa: 3.5,
    status: "active",
    emailVerified: false,
    enrollmentDate: "2024-08-15",
  },
  {
    id: 3,
    studentId: "STU2024003",
    name: "Mike Johnson",
    email: "mike.johnson@university.edu",
    program: "BSIS",
    yearLevel: 1,
    section: "A",
    gpa: 3.25,
    status: "active",
    emailVerified: true,
    enrollmentDate: "2024-08-15",
  },
]

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Students',
        href: 'admin/manageStudents',
    },
];



export default function ManageStudents({ students } : StudentProps) {
  useEffect(() => {
    console.log(students)
  },[])

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Manage Students" />
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl overflow-x-auto p-8 bg-[var(--bg-main)]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Students Management</h1>
              <p className="text-muted-foreground">Manage student accounts, enrollments, and academic records.</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Students</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search students..." className="pl-8 w-64" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.length > 0 ? (
                  students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src="" alt={student.student_name} />
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{student.student_name}</p>
                            <Badge variant="outline">{student.student_id}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MailCheck className="h-3 w-3 text-green-500" />
                            {student.student_email}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <span>{student.course_code}</span>
                            <span>Year {student.year_level}</span>
                            <span>Section {student.section}</span>
                            {/* <span>GPA: {student.gpa}</span> */}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* <Badge variant={student.status === "active" ? "default" : "secondary"}>{student.status}</Badge> */}
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
                  <div className="text-center py-8 text-muted-foreground">
                    No student data available. 
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
      </div>
    </AppLayout>
  );
}
