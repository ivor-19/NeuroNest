
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  BookOpen,
  Users,
  MoreHorizontal,
  CheckCircle,
  Search,
  Filter,
  TextSelect,
  ArrowUpDown,
  Calendar,
  GraduationCap,
  AlertCircle,
  Eye,
  Settings,
  Download,
  BarChart3,
  Grid3X3,
  List,
} from "lucide-react"
import HeaderLayout from "@/layouts/header-layout"
import { Head, router } from "@inertiajs/react"
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

type SortOption = "name" | "students" | "year" | "semester"
type ViewMode = "grid" | "list"

export default function Sections({ sections = [] }: InstructorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [semesterFilter, setSemesterFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  // Get unique values for filter options
  const uniqueSubjects = [...new Set(sections.map((section) => section.subject.code))]
  const uniqueSemesters = [...new Set(sections.map((section) => section.subject.semester))]
  const uniqueYears = [...new Set(sections.map((section) => section.year_level.toString()))]

  // Filter sections based on search and filters
  const filteredSections = sections.filter((section) => {
    const searchTermLower = searchTerm.toLowerCase()
    const matchesSearch =
      searchTerm === "" ||
      section.course_code.toLowerCase().includes(searchTermLower) ||
      section.subject.title.toLowerCase().includes(searchTermLower) ||
      section.subject.code.toLowerCase().includes(searchTermLower) ||
      section.section.toLowerCase().includes(searchTermLower) ||
      section.course_name.toLowerCase().includes(searchTermLower)

    const matchesSubject = subjectFilter === "all" || section.subject.code === subjectFilter
    const matchesSemester = semesterFilter === "all" || section.subject.semester === semesterFilter
    const matchesYear = yearFilter === "all" || section.year_level.toString() === yearFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && section.subject.isActive === 1) ||
      (statusFilter === "inactive" && section.subject.isActive === 0)

    return matchesSearch && matchesSubject && matchesSemester && matchesYear && matchesStatus
  })

  // Sort sections
  const sortedSections = [...filteredSections].sort((a, b) => {
    let aValue: string | number
    let bValue: string | number

    switch (sortBy) {
      case "name":
        aValue = a.subject.title.toLowerCase()
        bValue = b.subject.title.toLowerCase()
        break
      case "students":
        aValue = a.student_count
        bValue = b.student_count
        break
      case "year":
        aValue = a.year_level
        bValue = b.year_level
        break
      case "semester":
        aValue = a.subject.semester.toLowerCase()
        bValue = b.subject.semester.toLowerCase()
        break
      default:
        aValue = a.subject.title.toLowerCase()
        bValue = b.subject.title.toLowerCase()
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
    return 0
  })

  // Calculate stats based on filtered sections
  const totalSections = filteredSections.length
  const totalStudents = filteredSections.reduce((sum, section) => sum + section.student_count, 0)
  const activeSections = filteredSections.filter((section) => section.subject.isActive === 1).length
  const avgStudentsPerSection = totalSections > 0 ? Math.round(totalStudents / totalSections) : 0

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("")
    setSubjectFilter("all")
    setSemesterFilter("all")
    setYearFilter("all")
    setStatusFilter("all")
  }

  const hasActiveFilters =
    searchTerm !== "" ||
    subjectFilter !== "all" ||
    semesterFilter !== "all" ||
    yearFilter !== "all" ||
    statusFilter !== "all"

  return (
    <TooltipProvider>
      <HeaderLayout>
        <Head title={"My Sections"} />
        <div className="min-h-screen mt-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">My Sections</h1>
                <p className="text-muted-foreground">Manage all your assigned sections and subjects</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none cursor-pointer"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none cursor-pointer"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Sections</p>
                      <p className="text-2xl font-bold">{totalSections}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                      <p className="text-2xl font-bold">{totalStudents}</p>
                    </div>
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Sections</p>
                      <p className="text-2xl font-bold text-green-600">{activeSections}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg. Students</p>
                      <p className="text-2xl font-bold">{avgStudentsPerSection}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filter & Sort Sections
                  </CardTitle>
                  {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={clearFilters} className="cursor-pointer">
                      Clear Filters
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  {/* Search */}
                  <div className="lg:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search sections, subjects, courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Subject Filter */}
                  <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder="Subject" />
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

                  {/* Semester Filter */}
                  <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder="Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Semesters</SelectItem>
                      {uniqueSemesters.map((semester) => (
                        <SelectItem key={semester} value={semester}>
                          {semester}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Year Filter */}
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder="Year Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {uniqueYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          Year {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Status Filter */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active Only</SelectItem>
                      <SelectItem value="inactive">Inactive Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort Options */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                  <span className="text-sm font-medium">Sort by:</span>
                  <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                    <SelectTrigger className="w-[150px] cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Subject Name</SelectItem>
                      <SelectItem value="students">Student Count</SelectItem>
                      <SelectItem value="year">Year Level</SelectItem>
                      <SelectItem value="semester">Semester</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  >
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    {sortOrder === "asc" ? "Ascending" : "Descending"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="flex flex-col">
              {/* Results Count */}
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {sortedSections.length} of {sections.length} sections
                  {hasActiveFilters && " (filtered)"}
                </p>
                {hasActiveFilters && (
                  <Badge variant="secondary" className="text-xs">
                    {sections.length - filteredSections.length} hidden by filters
                  </Badge>
                )}
              </div>

              {/* Grid View */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedSections.map((section) => (
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
                                <div className="bg-green-500 hover:bg-green-600 h-3 w-3 rounded-full"> </div>
                              ) : (
                                <div className="bg-gray-500 hover:bg-gray-600 h-3 w-3 rounded-full"> </div>
                              )}
                            </div>

                            {/* Quick actions menu */}
                            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="secondary" size="sm" className="h-8 w-8 p-0 cursor-pointer">
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

                          <div className="flex gap-2 flex-wrap">
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
                              className="flex-1 rounded-xl cursor-pointer"
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
              )}

              {/* List View */}
              {viewMode === "list" && (
                <div className="space-y-4">
                  {sortedSections.map((section) => (
                    <Card key={`${section.id}-${section.subject.id}`} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 relative">
                              {section.subject.image ? (
                                <img
                                  src={`/public/storage/${section.subject.image}`}
                                  alt={`${section.subject.title} subject title`}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <div className="relative h-full rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                                  <PlaceholderPattern className="w-full h-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-lg">
                                  {section.course_code} - {section.year_level} {section.section}
                                </h3>
                                {section.subject.isActive === 1 ? (
                                  <div className="bg-green-500 h-3 w-3 rounded-full"></div>
                                ) : (
                                  <div className="bg-gray-500 h-3 w-3 rounded-full"></div>
                                )}
                              </div>
                              <p className="text-muted-foreground mb-2">
                                {section.subject.code} - {section.subject.title}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {section.student_count} students
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {section.subject.semester} Semester
                                </span>
                                <span className="flex items-center gap-1">
                                  <GraduationCap className="h-4 w-4" />
                                  Year {section.year_level}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="cursor-pointer"
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
              )}
            </div>
            

            {/* No Results */}
            {sortedSections.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-[var(bg-main)]
               rounded-xl">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-base font-medium text-gray-600 mb-2">
                  {hasActiveFilters
                    ? "No sections match your filters"
                    : "You are not currently assigned to any sections"}
                </h3>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters} className="mt-2 bg-transparent cursor-pointer">
                    Clear all filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </HeaderLayout>
    </TooltipProvider>
  )
}
