
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Users, FileText, Target, CheckCircle, Clock, AlertCircle } from "lucide-react"

interface Student {
  student_id: number
  name: string
  email: string
  course_code: string
  section: string
  status: string
  total_points: string
  year_level: number
}

interface QuizData {
  students: Student[]
  total_items: number
  total_points: string
}

interface AssessmentRespondentsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  quizData: QuizData
}

export default function AssessmentRespondentsModal({ open, onOpenChange, quizData }: AssessmentRespondentsProps) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return {
          color: "bg-emerald-50 border border-emerald-300 dark:bg-emerald-900/20 dark:border-emerald-700/80",
          icon: CheckCircle,
          iconColor: "text-emerald-600",
        }
      case "in progress":
        return {
          color: "bg-amber-50 border border-amber-300 dark:bg-amber-900/20 dark:border-amber-700/80",
          icon: Clock,
          iconColor: "text-amber-600",
        }
      default:
        return {
          color: "bg-slate-50 text-slate-700 border-slate-200",
          icon: AlertCircle,
          iconColor: "text-slate-600",
        }
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getPercentage = (points: string) => {
    const score = Number.parseFloat(points)
    const total = Number.parseFloat(quizData.total_points)
    return Math.round((score / total) * 100)
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return "text-emerald-600"
    if (percentage >= 80) return "text-blue-600"
    if (percentage >= 70) return "text-amber-600"
    return "text-red-600"
  }

  const completedStudents = quizData.students.filter((s) => s.status.toLowerCase() === "completed").length
  const averageScore =
    quizData.students.length > 0
      ? Math.round(
          quizData.students.reduce((acc, student) => acc + getPercentage(student.total_points), 0) /
            quizData.students.length,
        )
      : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[70%] overflow-y-auto max-h-[90%]">
        <DialogHeader className="pb-6 border-b">
          <DialogTitle className="text-2xl font-semibold ">Assessment Results Overview</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-6 pt-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2  rounded-lg bg-blue-50 border border-blue-300 dark:bg-blue-900/20 dark:border-blue-700/80">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Total Students</p>
                    <p className="text-2xl font-bold ">{quizData.students.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-300 dark:bg-emerald-900/20 dark:border-emerald-700/80">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Completed</p>
                    <p className="text-2xl font-bold ">{completedStudents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2  rounded-lg bg-purple-50 border border-purple-300 dark:bg-purple-900/20 dark:border-purple-700/80">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Questions</p>
                    <p className="text-2xl font-bold ">{quizData.total_items}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-300 dark:bg-amber-900/20 dark:border-amber-700/80">
                    <Target className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Average Score</p>
                    <p className="text-2xl font-bold ">{averageScore}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Student Results */}
          <div className="flex-1 overflow-hidden">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Student Performance</h3>
              <p className="text-sm text-slate-600">Individual results and completion status</p>
            </div>

            <div className="overflow-y-auto max-h-96 space-y-3 pr-2">
              {quizData.students.map((student) => {
                const statusConfig = getStatusConfig(student.status)
                const percentage = getPercentage(student.total_points)
                const StatusIcon = statusConfig.icon

                return (
                  <Card key={student.student_id} className="border hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <Avatar className="h-12 w-12 border">
                            <AvatarImage src={`/placeholder.svg?height=48&width=48`} />
                            <AvatarFallback className="text-sm font-semibold ">
                              {getInitials(student.name)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-base font-semibold  truncate">{student.name}</h4>
                              <Badge variant="outline" className={`${statusConfig.color} text-xs font-medium`}>
                                <StatusIcon className={`w-3 h-3 mr-1 ${statusConfig.iconColor}`} />
                                {student.status}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-accent-foreground">
                              <span className="truncate">{student.email}</span>
                              <span className="whitespace-nowrap">
                                {student.course_code}-{student.section}
                              </span>
                              <span className="whitespace-nowrap">Year {student.year_level}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right ml-4">
                          <div className="flex items-baseline space-x-1 mb-1">
                            <span className="text-xl font-bold ">{student.total_points}</span>
                            <span className="text-sm text-slate-500">/ {quizData.total_points}</span>
                          </div>
                          <div className={`text-sm font-semibold ${getScoreColor(percentage)}`}>{percentage}%</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
