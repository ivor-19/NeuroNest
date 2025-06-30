
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  BookOpen,
  Users,
  MoreHorizontal,
  TrendingUp,
  CheckCircle,
  TextSelect,
  Search,
  Calendar,
  GraduationCap,
  AlertCircle,
  Eye,
  Settings,
} from "lucide-react"
import HeaderLayout from "@/layouts/header-layout"
import { Head, router, usePage } from "@inertiajs/react"
import type { SharedData } from "@/types"
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern"

type Subject = {
  id: number
  code: string
  title: string
  description: string
  year_level: string
  semester: string
  isActive: number
  image: string
}

type Section = {
  id: number
  instructor_id: number
  course_id: number
  subject_id: number
  year_level: number
  section: string
  course_code: string
  course_name: string
  student_count: number
  subject: Subject
}

type InstructorProps = {
  sections: Section[]
}

export default function Dashboard({ sections = [] }: InstructorProps) {
  const { auth } = usePage<SharedData>().props
  const [showAllSections, setShowAllSections] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Filter sections based on search term
  const filteredSections = sections.filter(
    (section) =>
      section.subject.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.section.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Determine which sections to display based on showAll state
  const displayedSections = showAllSections ? filteredSections : filteredSections.slice(0, 3)

  // Calculate stats
  const totalSections = sections.length
  const totalStudents = sections.reduce((sum, section) => sum + section.student_count, 0)
  const activeSections = sections.filter((section) => section.subject.isActive === 1).length
  const inactiveSections = totalSections - activeSections

  // Get unique semesters
  const semesters = [...new Set(sections.map((section) => section.subject.semester))]
  const currentSemester = semesters[0] || "N/A"

  return (
    <TooltipProvider>
      <HeaderLayout>
        <Head title={"Dashboard"} />
        <div className="min-h-screen mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Welcome back, {auth.user.name}</h2>
                  <p className="text-gray-600">Here's what's happening with your sections today.</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-2">
                    <Calendar className="h-3 w-3 mr-1" />
                    Current Semester: {currentSemester}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Sections</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{activeSections}</div>
                  <p className="text-xs text-muted-foreground">
                    {inactiveSections > 0 && `${inactiveSections} inactive`}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalStudents}</div>
                  <p className="text-xs text-muted-foreground">
                    Avg: {totalSections > 0 ? Math.round(totalStudents / totalSections) : 0} per section
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Year Levels</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{[...new Set(sections.map((s) => s.year_level))].length}</div>
                  <p className="text-xs text-muted-foreground">Different levels</p>
                </CardContent>
              </Card>

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
              </TabsList>

              <TabsContent value="sections" className="space-y-6">
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search sections, subjects, or codes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600">
                      Showing {displayedSections.length} of {filteredSections.length} sections
                    </p>
                    {sections.length > 3 && (
                      <Button
                        variant="link"
                        className="text-primary hover:underline cursor-pointer"
                        onClick={() => router.visit(route("instructor.sections"))}
                      >
                        View All
                      </Button>
                    )}
                  </div>
                </div>

                {/* Subjects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedSections.map((section) => (
                    <Card
                      key={`${section.id}-${section.subject.id}`}
                      className="group hover:shadow-md transition-shadow"
                    >
                      <CardHeader>
                        <div className="flex flex-col">
                          <div className="w-full h-40 relative">
                            {section.subject.image ? (
                              <img
                                src={`/public/storage/${section.subject.image}`}
                                alt={`${section.subject.title} subject title`}
                                className="w-full h-full object-cover rounded-xl"
                              />
                            ) : (
                              <div className="relative h-full rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                                <PlaceholderPattern className="w-full h-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                  No image available
                                </div>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                            {/* Status indicator */}
                            <div className="absolute top-2 right-2">
                              {section.subject.isActive === 1 ? (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div className="bg-green-500 hover:bg-green-600 h-3 w-3 rounded-full">
                                     
                                   
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Subject is currently active</p>
                                  </TooltipContent>
                                </Tooltip>
                              ) : (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div className="bg-gray-500 hover:bg-gray-600">
                                      
                                      
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Subject is currently inactive</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>

                            {/* Quick actions menu */}
                            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.visit(
                                        route("instructor.modules", {
                                          course_id: section.course_id,
                                          year_level: section.year_level,
                                          section: section.section,
                                          subject_id: section.subject_id,
                                        }),
                                      )
                                    }
                                  >
                                    <Settings className="h-4 w-4 mr-2" />
                                    Manage Subject
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          <div className="flex items-start justify-between mt-2">
                            <CardTitle className="text-lg">
                              {section.course_code} - {section.year_level} {section.section}
                            </CardTitle>
                            <Badge variant="outline" className="ml-2 shrink-0">
                              Year {section.year_level}
                            </Badge>
                          </div>
                        </div>

                        <CardDescription className="flex flex-col gap-2">
                          <div className="flex items-center">
                            <TextSelect className="h-4 w-4 mr-2" />
                            {section.subject.code} - {section.subject.title}
                          </div>

                          {/* Subject description */}
                          {section.subject.description && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="text-xs text-muted-foreground line-clamp-2 cursor-help">
                                  {section.subject.description}
                                </p>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>{section.subject.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}

                          <div className="flex gap-2">
                            <Badge variant={"outline"}>
                              <Calendar className="h-3 w-3 mr-1" />
                              {section.subject.semester} Sem
                            </Badge>
                            <Badge variant={"secondary"}>
                              <Users className="h-3 w-3 mr-1" />
                              {section.student_count} students
                            </Badge>
                          </div>
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex flex-col">
                              <span className="text-muted-foreground">Course</span>
                              <span className="font-medium truncate" title={section.course_name}>
                                {section.course_name}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-muted-foreground">Enrollment</span>
                              <span className="font-medium">
                                {section.student_count}
                                <span className="text-muted-foreground ml-1">
                                  student{section.student_count !== 1 ? "s" : ""}
                                </span>
                              </span>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="flex-1 rounded-xl"
                              onClick={() =>
                                router.visit(
                                  route("instructor.modules", {
                                    course_id: section.course_id,
                                    year_level: section.year_level,
                                    section: section.section,
                                    subject_id: section.subject_id,
                                  }),
                                )
                              }
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Manage
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* No Sections Message */}
                {filteredSections.length === 0 && searchTerm && (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No sections found for "{searchTerm}"</h3>
                    <p className="text-gray-600">Try adjusting your search terms</p>
                  </div>
                )}

                {sections.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      You are not currently assigned to any sections
                    </h3>
                    <p className="text-gray-600">Contact your administrator to get assigned to sections</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </HeaderLayout>
    </TooltipProvider>
  )
}
