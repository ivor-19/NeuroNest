import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Star, CheckCircle, Lock, ArrowLeft, FileText, Video, Award, ChevronRight } from "lucide-react"
import HeaderLayout from "@/layouts/header-layout"
import { Head, router } from "@inertiajs/react"

interface Module {
  id: number
  title: string
  description: string
  isActive: boolean
  isCompleted?: boolean // Added optional completed status
  duration?: string
  lessons?: number
  type?: "video" | "reading" | "quiz"
}

interface Subject {
  id: number
  title: string
  description: string
  modules: Module[]
}

interface Props {
  subject: Subject
  modules: Module[]
}

export default function Modules({ subject, modules }: Props) {
  const [isEnrolled, setIsEnrolled] = useState(true)

  // Calculate progress only on enrolled and completed modules
  const completedModules = modules.filter((module) => module.isCompleted).length
  const progress = modules.length > 0 ? (completedModules / modules.length) * 100 : 0

  return (
    <HeaderLayout>
      <Head title={subject.title} />
      <div className="min-h-screen mt-14">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => router.visit(route('student.dashboard'))} className="mb-6 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go back
          </Button>

          {/* Course Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{subject.title}</h1>
                <p className="text-lg text-gray-600 max-w-3xl">{subject.description}</p>
              </div>
            </div>

            {/* Progress Section */}
            {isEnrolled && modules.length > 0 && (
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Course Progress</h3>
                      <p className="text-sm text-gray-500">
                        {completedModules} of {modules.length} modules completed
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</div>
                    </div>
                  </div>
                  <Progress value={progress} className="h-2" />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Modules Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Subject Content</h2>
              <span className="text-sm text-gray-500">{modules.length} {modules.length === 1 ? 'module' : 'modules'}</span>
            </div>

            {modules.length > 0 ? (
              <div className="space-y-3">
                {modules.map((module, index) => (
                  <Card
                    key={module.id}
                    className={`transition-all duration-200 hover:shadow-md cursor-pointer border ${
                      module.isCompleted
                        ? "border-green-200 bg-green-50/50"
                        : isEnrolled
                          ? "border-gray-200 bg-white hover:border-blue-200"
                          : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center space-x-4">
                        {/* Module Status Icon */}
                        <div className="flex-shrink-0">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                              module.isCompleted
                                ? "bg-green-100 text-green-700"
                                : isEnrolled
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {module.isCompleted ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : isEnrolled ? (
                              <span>{index + 1}</span>
                            ) : (
                              <Lock className="h-5 w-5" />
                            )}
                          </div>
                        </div>

                        {/* Module Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-base font-medium text-gray-900 truncate">{module.title}</h3>
                              </div>
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{module.description}</p>

                              {/* Module Meta */}
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                {module.type && (
                                  <div className="flex items-center gap-1">
                                    {module.type === "video" && <Video className="h-3 w-3" />}
                                    {module.type === "reading" && <FileText className="h-3 w-3" />}
                                    {module.type === "quiz" && <Star className="h-3 w-3" />}
                                    <span className="capitalize">{module.type}</span>
                                  </div>
                                )}
                                {module.duration && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{module.duration}</span>
                                  </div>
                                )}
                                {module.lessons && <span>{module.lessons} lessons</span>}
                              </div>
                            </div>

                            {/* Action Button */}
                            <div className="flex items-center gap-2 ml-4">
                              {isEnrolled && (
                                <Button size="sm" variant={module.isCompleted ? "outline" : "default"} className="text-xs">
                                  {module.isCompleted ? "Review" : "Start"}
                                </Button>
                              )}
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-0 shadow-sm">
                <CardContent className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No modules available</h3>
                  <p className="text-sm text-gray-500">There are no modules for this subject in your course.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Completion Card */}
          {isEnrolled && modules.length > 0 && progress < 100 && (
            <Card className="mt-8 border-0 shadow-sm bg-blue-50">
              <CardContent className="p-6 text-center">
                <div className="max-w-md mx-auto">
                  <Award className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Complete this course to earn your certificate
                  </h3>
                  <div className="mb-4">
                    <Progress value={progress} className="mb-2" />
                    <p className="text-sm text-gray-600">
                      {completedModules} of {modules.length} modules completed
                    </p>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">Continue Learning</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </HeaderLayout>
  )
}