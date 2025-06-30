"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BookOpen, Clock, Play, User, GraduationCap, Calendar, Search, Star, Mail, Bell, Target } from "lucide-react"
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern"
import { Head, router } from "@inertiajs/react"
import HeaderLayout from "@/layouts/header-layout"

interface Subject {
  id: number
  code: string
  title: string
  description: string
  isActive: boolean
  semester: string
  image: string
  instructor_name?: string
  instructor_email?: string
}

interface StudentDashboardProps {
  user: any
  subjects: Subject[]
}

export default function Dashboard({ user, subjects }: StudentDashboardProps) {
  const [studentSubjects, setStudentSubjects] = useState<Subject[]>(subjects || [])
  const [searchTerm, setSearchTerm] = useState("")
  const [semesterFilter, setSemesterFilter] = useState("all")
  const [favoriteSubjects, setFavoriteSubjects] = useState<number[]>([])

  // Update subjects when props change
  useEffect(() => {
    setStudentSubjects(subjects || [])
  }, [subjects])

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("favoriteSubjects")
    if (saved) {
      setFavoriteSubjects(JSON.parse(saved))
    }
  }, [])

  // Save favorites to localStorage
  const toggleFavorite = (subjectId: number) => {
    const newFavorites = favoriteSubjects.includes(subjectId)
      ? favoriteSubjects.filter((id) => id !== subjectId)
      : [...favoriteSubjects, subjectId]

    setFavoriteSubjects(newFavorites)
    localStorage.setItem("favoriteSubjects", JSON.stringify(newFavorites))
  }

  // Filter subjects
  const filteredSubjects = studentSubjects.filter((subject) => {
    const matchesSearch =
      searchTerm === "" ||
      subject.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.instructor_name?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSemester = semesterFilter === "all" || subject.semester === semesterFilter

    return matchesSearch && matchesSemester
  })

  // Calculate stats from actual data
  const activeSubjects = studentSubjects.filter((subject) => subject.isActive).length
  const uniqueSemesters = [...new Set(studentSubjects.map((subject) => subject.semester))].length
  const uniqueInstructors = [...new Set(studentSubjects.map((subject) => subject.instructor_name).filter(Boolean))]
    .length
  const completionRate = studentSubjects.length > 0 ? Math.round((activeSubjects / studentSubjects.length) * 100) : 0

  // Mock data for additional features
  const upcomingDeadlines = 3
  const studyStreak = 7

  return (
    <TooltipProvider>
      <HeaderLayout>
        <Head title={"Dashboard"} />
        <div className="min-h-screen mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Student Dashboard */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
                  <p className="text-gray-600 mt-2">Continue your learning journey</p>
                </div>
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        <Target className="h-3 w-3 mr-1" />
                        {studyStreak} day streak
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Keep up the great work!</p>
                    </TooltipContent>
                  </Tooltip>
                  {/* <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Bell className="h-4 w-4 mr-2" />
                        {upcomingDeadlines > 0 && (
                          <Badge variant="destructive" className="mr-2 h-5 w-5 p-0 text-xs">
                            {upcomingDeadlines}
                          </Badge>
                        )}
                        Notifications
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>You have {upcomingDeadlines} upcoming deadlines</p>
                    </TooltipContent>
                  </Tooltip> */}
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Subjects</p>
                      <p className="text-2xl font-bold">{studentSubjects.length}</p>
                      <p className="text-xs text-muted-foreground">{favoriteSubjects.length} favorited</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Subjects</p>
                      <p className="text-2xl font-bold">{activeSubjects}</p>
                      <p className="text-xs text-muted-foreground">{completionRate}% completion</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Semesters</p>
                      <p className="text-2xl font-bold">{uniqueSemesters}</p>
                      <p className="text-xs text-muted-foreground">Academic periods</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <GraduationCap className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Instructors</p>
                      <p className="text-2xl font-bold">{uniqueInstructors}</p>
                      <p className="text-xs text-muted-foreground">Teaching you</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* My Subjects */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" /> Academic Subjects
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Browse and access your enrolled subjects ({filteredSubjects.length} of {studentSubjects.length})
                    </p>
                  </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-between">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search subjects or instructors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Semesters</SelectItem>
                      {[...new Set(studentSubjects.map((subject) => subject.semester))].map((semester) => (
                        <SelectItem key={semester} value={semester}>
                          Semester {semester}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>

              {studentSubjects.length === 0 ? (
                <div className="text-center text-gray-500 py-10 border rounded-md">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg">You are not enrolled in any subjects yet.</p>
                  <p className="text-sm mt-2">Please contact your administrator or check back later.</p>
                </div>
              ) : filteredSubjects.length === 0 ? (
                <div className="text-center text-gray-500 py-10 border rounded-md mx-6 mb-6">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg">No subjects match your search criteria.</p>
                  <p className="text-sm mt-2">Try adjusting your search terms or filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                  {filteredSubjects.map((subject) => (
                    <Card
                      key={subject.id}
                      className="hover:bg-muted/50 transition-colors cursor-pointer group"
                      onClick={() => router.visit(route("student.modules", { subject_id: subject.id }))}
                    >
                      <CardContent className="p-2 flex flex-col gap-4">
                        <div className="w-full h-48 relative">
                          {subject.image ? (
                            <img
                              src={`/public/storage/${subject.image}`}
                              alt={`${subject.title} subject title`}
                              className="w-full h-full object-cover rounded-t-lg"
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

                          {/* Favorite button */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleFavorite(subject.id)
                                }}
                                className="absolute top-2 left-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <Star
                                  className={`h-4 w-4 ${
                                    favoriteSubjects.includes(subject.id)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-600"
                                  }`}
                                />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {favoriteSubjects.includes(subject.id) ? "Remove from favorites" : "Add to favorites"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>

                        <div>
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{subject.title}</h3>
                                {favoriteSubjects.includes(subject.id) && (
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{subject.code}</p>
                            </div>
                            <Badge variant={subject.isActive ? "default" : "secondary"}>
                              {subject.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground mb-4">{subject.description}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">Sem {subject.semester}</Badge>
                              {subject.instructor_name && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <User className="h-4 w-4" />
                                  {subject.instructor_name}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {subject.instructor_email && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        window.location.href = `mailto:${subject.instructor_email}`
                                      }}
                                    >
                                      <Mail className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Email {subject.instructor_name}</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Play className="h-4 w-4" /> View modules
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </HeaderLayout>
    </TooltipProvider>
  )
}
