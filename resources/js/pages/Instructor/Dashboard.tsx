import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Users,
  FileText,
  MoreHorizontal,
  TrendingUp,
  Clock,
  CheckCircle,
  TextSelect,
} from "lucide-react"
import HeaderLayout from "@/layouts/header-layout"
import { Head, router, usePage } from "@inertiajs/react"
import { SharedData } from "@/types"
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern"

type Subject = {
  id: number;
  code: string;
  title: string;
  description: string;
  year_level: string;
  semester: string;
  isActive: number;
  image: string;
}

type Section = {
  id: number;
  instructor_id: number;
  course_id: number;
  subject_id: number;
  year_level: number;
  section: string;
  course_code: string;
  course_name: string;
  student_count: number;
  subject: Subject;
}

type InstructorProps = {
  sections: Section[];
}

export default function Dashboard({ sections = [] }: InstructorProps) {
  const { auth } = usePage<SharedData>().props;
  const [showAllSections, setShowAllSections] = useState(false)

  // Determine which sections to display based on showAll state
  const displayedSections = showAllSections ? sections : sections.slice(0, 3)

  // Calculate stats
  const totalSections = sections.length
  const totalStudents = sections.reduce((sum, section) => sum + section.student_count, 0)
  const pendingGrades = sections.length * 5 // Mock data

  return (
    <HeaderLayout>
      <Head title={'Dashboard'} />
      <div className="min-h-screen mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Welcome back, {auth.user.name}</h2>
            <p className="text-gray-600">Here's what's happening with your sections today.</p>
          </div>
  
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sections</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSections}</div>
                <p className="text-xs text-muted-foreground">+1 from last semester</p>
              </CardContent>
            </Card>
  
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStudents}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
  
            {/* <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Grades</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingGrades}</div>
                <p className="text-xs text-muted-foreground">Due this week</p>
              </CardContent>
            </Card> */}
  
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">75%</div>
                <p className="text-xs text-muted-foreground">+2% from last month</p>
              </CardContent>
            </Card>
          </div>
  
          {/* Main Content */}
          <Tabs defaultValue="sections" className="space-y-6">
            <TabsList className="rounded-xl">
              <TabsTrigger value="sections">My Sections</TabsTrigger>
              {/* <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger> */}
            </TabsList>
  
            <TabsContent value="sections" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600">
                  Showing {displayedSections.length} of {totalSections} sections
                </p>
                {sections.length > 3 && (
                  <Button 
                    variant="link" 
                    className="text-primary hover:underline cursor-pointer" 
                    onClick={() => router.visit(route('instructor.sections'))}
                  >
                    {showAllSections ? 'Show Less' : 'View All'}
                  </Button>
                )}
              </div>
              
              {/* Subjects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedSections.map(section => (
                  <Card key={`${section.id}-${section.subject.id}`}>
                    <CardHeader>
                      <div className="flex flex-col">
                        <div className="w-full h-40">
                          {section.subject.image ? (
                            <img
                              src={`/storage/${section.subject.image}`}
                              alt={`${section.subject.title} subject title`}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          ):(
                            <div className="relative h-full rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                              <PlaceholderPattern className="w-full h-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                              
                              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                No image available
                              </div>
                            </div>
                          )}
                        </div>
                        <CardTitle className="text-lg mt-2">
                          {section.course_code} - {section.year_level} {section.section}
                        </CardTitle>
                      
                      </div>
                      <CardDescription className="flex flex-col gap-2">
                        <div className="flex items-center">
                          <TextSelect className="h-4 w-4 mr-2" />
                          {section.subject.code} - {section.subject.title}
                        </div>
                        <Badge variant={'outline'}>{section.subject.semester} Sem</Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Students enrolled</span>
                          <span className="font-medium">{section.student_count}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Subject Status</span>
                     
                          <span className="font-medium capitalize">
                            {section.subject.isActive === 1 ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1 rounded-xl" onClick={() => router.visit(route('instructor.modules', { course_id: section.course_id, year_level: section.year_level, section: section.section, subject_id: section.subject_id }))}>
                            Manage Subject
                          </Button>
                          {/* <Button size="sm" variant="outline" className="rounded-xl" onClick={() => console.log(section.subject.id)}>
                            View
                          </Button> */}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* No Sections Message */}
              {sections.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    You are not currently assigned to any sections
                  </h3>
                </div>
              )}
            </TabsContent>
  
            <TabsContent value="assignments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Assignments</CardTitle>
                  <CardDescription>Assignments that need your attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Clock className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Midterm Exam - College Algebra</h4>
                          <p className="text-sm text-muted-foreground">23 submissions pending review</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">Due Today</Badge>
                        <p className="text-sm text-muted-foreground mt-1">90 students</p>
                      </div>
                    </div>
  
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Quiz 3 - Calculus I</h4>
                          <p className="text-sm text-muted-foreground">All submissions graded</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">Completed</Badge>
                        <p className="text-sm text-muted-foreground mt-1">25 students</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
  
            <TabsContent value="students" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Student Overview</CardTitle>
                  <CardDescription>Recent student activity and performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Student" />
                          <AvatarFallback>AS</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">Alice Smith</h4>
                          <p className="text-sm text-muted-foreground">MATH-101-A, MATH-201-A</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">A- Average</Badge>
                        <p className="text-sm text-muted-foreground mt-1">Last active: 2 hours ago</p>
                      </div>
                    </div>
  
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Student" />
                          <AvatarFallback>BJ</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">Bob Johnson</h4>
                          <p className="text-sm text-muted-foreground">MATH-301-A</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">B+ Average</Badge>
                        <p className="text-sm text-muted-foreground mt-1">Last active: 1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </HeaderLayout>
  )
}