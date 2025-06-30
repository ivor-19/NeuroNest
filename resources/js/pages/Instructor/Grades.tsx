import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Users, TrendingUp, FileText, Download, Calendar, Clock, Search, Filter } from "lucide-react"
import { useEffect, useState } from "react"
import HeaderLayout from "@/layouts/header-layout"
import { Head } from "@inertiajs/react"

// Define types for the data structures
interface Student {
  id: number
  name: string
  email: string
}

interface Question {
  id: number
  points: number
}

interface Grade {
  student_id: number
  student: Student
  score: number
}

interface Assessment {
  id: number
  title: string
  description: string
  created_at: string
  questions: Question[]
  grades: Grade[]
}

interface Course {
  id: number
  name: string
  code: string
}

interface Subject {
  id: number
  code: string
  title: string
  year_level: number
  section: string
  course: Course
  assessments: Assessment[]
  students?: Student[]
}

interface Instructor {
  id: number
  name: string
}

interface AssessmentType {
  id: number
  name: string
}

type GradesProps = {
  instructor: Instructor
  subjects: Subject[]
  assessmentTypes: AssessmentType[]
}

// Helper functions with proper typing
function getMaxScore(assessment: Assessment): number {
  return assessment.questions.reduce((total: number, question: Question) => total + question.points, 0)
}

function getGradeColor(score: number, maxScore: number): string {
  const percentage = (score / maxScore) * 100
  if (percentage >= 90) return "text-green-600"
  if (percentage >= 80) return "text-blue-600"
  if (percentage >= 70) return "text-yellow-600"
  if (percentage >= 60) return "text-orange-600"
  return "text-red-600"
}

function getAssessmentBadgeColor(title: string): string {
  const lowerTitle = title.toLowerCase()
  if (lowerTitle.includes("quiz")) return "bg-blue-100 text-blue-800"
  if (lowerTitle.includes("exam")) return "bg-red-100 text-red-800"
  if (lowerTitle.includes("project")) return "bg-green-100 text-green-800"
  return "bg-purple-100 text-purple-800"
}

function getAllStudentsInSubject(subject: Subject): Student[] {
  if (subject.students && subject.students.length > 0) {
    return subject.students
  }

  const studentMap = new Map<number, Student>()
  subject.assessments.forEach((assessment: Assessment) => {
    assessment.grades.forEach((grade: Grade) => {
      if (!studentMap.has(grade.student.id)) {
        studentMap.set(grade.student.id, grade.student)
      }
    })
  })

  return Array.from(studentMap.values())
}

function getStudentGrade(assessment: Assessment, studentId: number): number {
  const grade = assessment.grades.find((g: Grade) => g.student_id === studentId)
  return grade ? grade.score : 0
}

function calculateStudentAverage(studentId: number, assessments: Assessment[]): string {
  let totalEarned = 0
  let totalPossible = 0

  assessments.forEach((assessment) => {
    const score = getStudentGrade(assessment, studentId)
    const maxScore = getMaxScore(assessment)
    totalEarned += score
    totalPossible += maxScore
  })

  return totalPossible > 0 ? ((totalEarned / totalPossible) * 100).toFixed(1) : "0.0"
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function Grades({ instructor, subjects, assessmentTypes }: GradesProps) {
  // State for filters and search
  const [selectedSubject, setSelectedSubject] = useState<string>(subjects.length > 0 ? subjects[0].code : "")
  const [studentSearch, setStudentSearch] = useState<string>("")
  const [assessmentSearch, setAssessmentSearch] = useState<string>("")
  const [assessmentTypeFilter, setAssessmentTypeFilter] = useState<string>("all")
  const [courseYearSectionFilter, setCourseYearSectionFilter] = useState<string>("all")

  // Calculate totals
  useEffect(() => {
    console.log(subjects)
  }, [subjects])

  const totalSubjects = subjects.length
  const totalAssessments = subjects.reduce((sum, subject) => sum + subject.assessments.length, 0)
  const allStudents = new Set<number>()
  subjects.forEach((subject) => {
    subject.assessments.forEach((assessment) => {
      assessment.grades.forEach((grade) => {
        allStudents.add(grade.student_id)
      })
    })
  })
  const totalStudents = allStudents.size

  // Get current subject
  const currentSubject = subjects.find((subject) => subject.code === selectedSubject)

  // Generate combined filter options
  const combinedFilterOptions = subjects.reduce((acc: {id: string, label: string}[], subject) => {
    const option = {
      id: `${subject.course.id}-${subject.year_level}-${subject.section}`,
      label: `${subject.course.code} - Year ${subject.year_level} - Section ${subject.section}`
    }
    
    if (!acc.some(item => item.id === option.id)) {
      acc.push(option)
    }
    
    return acc
  }, [])

  // Filter subjects based on selected combined filter
  const filteredSubjects = courseYearSectionFilter === "all" 
    ? subjects 
    : subjects.filter(subject => {
        const [courseId, year, section] = courseYearSectionFilter.split('-')
        return (
          subject.course.id.toString() === courseId &&
          subject.year_level.toString() === year &&
          subject.section === section
        )
      })

  // Update selected subject if it's no longer in filtered results
  useEffect(() => {
    if (selectedSubject && !filteredSubjects.find((s) => s.code === selectedSubject)) {
      setSelectedSubject(filteredSubjects.length > 0 ? filteredSubjects[0].code : "")
    }
  }, [filteredSubjects, selectedSubject])

  const getFilteredStudents = (subject: Subject) => {
    const studentsInSubject = getAllStudentsInSubject(subject)
    return studentsInSubject.filter(
      (student) =>
        student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        student.email.toLowerCase().includes(studentSearch.toLowerCase()),
    )
  }

  const getFilteredAssessments = (subject: Subject) => {
    return subject.assessments.filter((assessment) => {
      const matchesSearch =
        assessment.title.toLowerCase().includes(assessmentSearch.toLowerCase()) ||
        assessment.description.toLowerCase().includes(assessmentSearch.toLowerCase())

      const matchesType =
        assessmentTypeFilter === "all" || assessment.title.toLowerCase().includes(assessmentTypeFilter.toLowerCase())

      return matchesSearch && matchesType
    })
  }

  return (
    <HeaderLayout>
      <Head title="Grades" />
      <div className="min-h-screen mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSubjects}</div>
                <p className="text-xs text-muted-foreground">Active this semester</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStudents}</div>
                <p className="text-xs text-muted-foreground">Across all subjects</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assessments</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAssessments}</div>
                <p className="text-xs text-muted-foreground">Total assignments</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* Combined Course/Year/Section Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Course/Year/Section</label>
                  <Select value={courseYearSectionFilter} onValueChange={setCourseYearSectionFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All courses/years/sections" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses/Years/Sections</SelectItem>
                      {combinedFilterOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subject Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSubjects.map((subject) => (
                        <SelectItem key={subject.code} value={subject.code}>
                          {subject.code} - {subject.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Assessment Type Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Assessment Type</label>
                  <Select value={assessmentTypeFilter} onValueChange={setAssessmentTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Student Search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search Students</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or email..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Assessment Search - Keep this separate row */}
              <div className="mt-4">
                <label className="text-sm font-medium">Search Assessments</label>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search assessments by title or description..."
                    value={assessmentSearch}
                    onChange={(e) => setAssessmentSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredSubjects.length} of {subjects.length} subjects
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCourseYearSectionFilter("all")
                    setAssessmentTypeFilter("all")
                    setStudentSearch("")
                    setAssessmentSearch("")
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Subject Content */}
          {currentSubject && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{currentSubject.title}</CardTitle>
                    <CardDescription>
                      {currentSubject.code} • {currentSubject.course.name} • Year {currentSubject.year_level} Section{" "}
                      {currentSubject.section}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{currentSubject.course.code}</Badge>
                    <Badge variant="outline">
                      {getAllStudentsInSubject(currentSubject).length} student
                      {getAllStudentsInSubject(currentSubject).length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Assessments Overview */}
                {getFilteredAssessments(currentSubject).length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">
                      Assessments
                      {assessmentSearch && (
                        <span className="text-sm text-muted-foreground ml-2">
                          ({getFilteredAssessments(currentSubject).length} of {currentSubject.assessments.length})
                        </span>
                      )}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {getFilteredAssessments(currentSubject).map((assessment) => (
                        <div key={assessment.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={getAssessmentBadgeColor(assessment.title)}>{assessment.title}</Badge>
                            <span className="text-sm text-gray-500">{getMaxScore(assessment)} pts</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{assessment.description}</p>
                          <div className="flex items-center text-xs text-gray-500 space-x-4">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Created: {formatDate(assessment.created_at)}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {assessment.questions.length} question{assessment.questions.length !== 1 ? "s" : ""}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Students Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium">
                      Students
                      {studentSearch && (
                        <span className="text-sm text-muted-foreground ml-2">
                          ({getFilteredStudents(currentSubject).length} of{" "}
                          {getAllStudentsInSubject(currentSubject).length})
                        </span>
                      )}
                    </h3>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Grades
                    </Button>
                  </div>

                  {getFilteredStudents(currentSubject).length === 0 ? (
                    <div className="text-center py-8 border rounded-lg">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-00 mb-2">
                        {studentSearch ? "No students found" : "No Students Enrolled"}
                      </h4>
                      <p className="text-gray-500 mb-4">
                        {studentSearch
                          ? "Try adjusting your search terms."
                          : "Add students to this subject to start tracking their progress."}
                      </p>
                    
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[200px]">Student</TableHead>
                            {getFilteredAssessments(currentSubject).length > 0 ? (
                              <>
                                {getFilteredAssessments(currentSubject).map((assessment) => (
                                  <TableHead key={assessment.id} className="text-center">
                                    <div className="flex flex-col">
                                      <span className="font-medium">{assessment.title}</span>
                                      <span className="text-xs text-muted-foreground">{getMaxScore(assessment)} pts</span>
                                    </div>
                                  </TableHead>
                                ))}
                                {/* <TableHead className="text-center">Average</TableHead> */}
                              </>
                            ) : (
                              <TableHead>Status</TableHead>
                            )}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getFilteredStudents(currentSubject).map((student) => (
                            <TableRow key={student.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                      {student.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{student.name}</div>
                                    <div className="text-sm text-muted-foreground">{student.email}</div>
                                  </div>
                                </div>
                              </TableCell>
                              {getFilteredAssessments(currentSubject).length > 0 ? (
                                <>
                                  {getFilteredAssessments(currentSubject).map((assessment) => {
                                    const score = getStudentGrade(assessment, student.id)
                                    const maxScore = getMaxScore(assessment)
                                    return (
                                      <TableCell key={assessment.id} className="text-center">
                                        <span className={`font-medium ${getGradeColor(score, maxScore)}`}>
                                          {score}/{maxScore}
                                        </span>
                                        <div className="text-xs text-muted-foreground">
                                          {maxScore > 0 ? ((score / maxScore) * 100).toFixed(0) : 0}%
                                        </div>
                                      </TableCell>
                                    )
                                  })}
                                  {/* <TableCell className="text-center">
                                    <div className="flex items-center justify-center space-x-1">
                                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">
                                        {calculateStudentAverage(student.id, getFilteredAssessments(currentSubject))}%
                                      </span>
                                    </div>
                                  </TableCell> */}
                                </>
                              ) : (
                                <TableCell>
                                  <Badge variant="secondary">Enrolled</Badge>
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {subjects.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Subjects Available</h4>
                <p className="text-gray-500">Start by adding subjects to manage grades.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </HeaderLayout>
  )
}