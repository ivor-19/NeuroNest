import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BookOpen,
  Users,
  FileText,
  Plus,
  MoreHorizontal,
  TrendingUp,
  Clock,
  CheckCircle,
  Search,
  Filter,
  TextSelect,
} from "lucide-react"
import HeaderLayout from "@/layouts/header-layout"
import { Head, router, usePage } from "@inertiajs/react"
import { SharedData } from "@/types"

type Subject = {
  id: number;
  code: string;
  title: string;
  description: string;
  year_level: string;
  semester: string;
  isActive: number;
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

export default function Sections({ sections = [] }: InstructorProps) {

  const [searchTerm, setSearchTerm] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [semesterFilter, setSemesterFilter] = useState("all")

  // Get unique subjects and semesters for filter options
  const uniqueSubjects = [...new Set(sections.map(section => section.subject.code))]
  const uniqueSemesters = [...new Set(sections.map(section => section.subject.semester))]

  // Filter sections based on search and filters
  const filteredSections = sections.filter(section => {
    const searchTermLower = searchTerm.toLowerCase()
    const matchesSearch = 
      searchTerm === '' || 
      section.course_code.toLowerCase().includes(searchTermLower) ||
      section.subject.title.toLowerCase().includes(searchTermLower) ||
      section.subject.code.toLowerCase().includes(searchTermLower) ||
      section.section.toLowerCase().includes(searchTermLower)

    const matchesSubject = subjectFilter === 'all' || section.subject.code === subjectFilter
    const matchesSemester = semesterFilter === 'all' || section.subject.semester === semesterFilter
    
    return matchesSearch && matchesSubject && matchesSemester
  })

  // Calculate stats based on filtered sections
  const totalSections = filteredSections.length
  const totalStudents = filteredSections.reduce((sum, section) => sum + section.student_count, 0)
  const pendingGrades = filteredSections.length * 5 // Mock data

  return (
    <HeaderLayout>
      <Head title={'My Sections'} />
      <div className="min-h-screen mt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Sections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search sections, subjects, or rooms..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Subject Filter */}
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter by Subject" />
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
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter by Semester" />
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
              </div>
            </CardContent>
          </Card>
          {/* Subjects Grid */}
          <div className="flex flex-col">
            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">Showing {filteredSections.length} sections</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSections.map(section => (
                <Card key={`${section.id}-${section.subject.id}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {section.course_code} - {section.year_level} {section.section}
                      </CardTitle>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
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
                        <Badge variant={'outline'} className="font-mono capitalize">
                          {section.subject.isActive === 1 ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1 rounded-xl" onClick={() => router.visit(route('instructor.modules', { course_id: section.course_id, year_level: section.year_level, section: section.section, subject_id: section.subject_id }))}>
                          Manage Subject
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-xl" onClick={() => console.log(section.subject.id)}>
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* No Results */}
          {filteredSections.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || subjectFilter !== 'all' || semesterFilter !== 'all' 
                  ? "No sections match your filters" 
                  : "You are not currently assigned to any sections"}
              </h3>
            </div>
          )}
        </div>
      </div>
    </HeaderLayout>
  )
}