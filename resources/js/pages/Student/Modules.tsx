import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Clock,
  Star,
  CheckCircle,
  Lock,
  ArrowLeft,
  FileText,
  Video,
  Award,
  ChevronRight,
  AlertCircle,
  Download,
} from "lucide-react"
import HeaderLayout from "@/layouts/header-layout"
import { Head, router, usePage } from "@inertiajs/react"
import { SharedData } from "@/types"
import { toast } from "sonner"

interface Module {
  id: number
  title: string
  description: string
  isActive: boolean
  isDone?: boolean
  lessons?: number
  pdf: string
  type?: "video" | "reading" | "quiz"
  status?: "available" | "disabled"
}

interface Subject {
  id: number
  title: string
  description: string
  image: string
  modules: Module[]
}

interface Props {
  subject: Subject
  modules: Module[]
}

export default function Component({ subject, modules }: Props) {
  const { auth } = usePage<SharedData>().props
  const [isEnrolled, setIsEnrolled] = useState(true)

  // Calculate progress only on available and completed modules
  const availableModules = modules.filter((module) => module.isActive)
  const completedModules = availableModules.filter((module) => module.isDone).length
  const progress = availableModules.length > 0 ? (completedModules / availableModules.length) * 100 : 0

  // Count disabled modules
  const disabledCount = modules.filter((module) => !module.isActive).length

  const getModuleIcon = (type?: string) => {
    switch (type) {
      case "video":
        return <Video className="h-3 w-3" />
      case "reading":
        return <FileText className="h-3 w-3" />
      case "quiz":
        return <Star className="h-3 w-3" />
      default:
        return <BookOpen className="h-3 w-3" />
    }
  }

  const handleModuleDone = async (moduleId: number) => {
    router.post(route('student.moduleCompletion'), {student_id: auth.user.id, module_id: moduleId}, {
      onSuccess: () => {
        toast.success('Module Completed')
      },
      onError: () => {
        toast.error('Error has occured. Try again.')
      }
    })
  }

  const handleDownloadPdf = async (id: number) => {
    try {
      window.location.href = route('student.moduleDownload', { id: id });

      setTimeout(() => {
        toast.success('Module download started');
      }, 500);
      
    } catch (error) {
      console.error('Download failed', error);
      toast.error('Download failed. Please try again.');
    }
  };

  return (
    <HeaderLayout>
      <Head title={subject.title} />
      <div className="min-h-screen mt-14">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.visit(route("student.dashboard"))}
            className="mb-8 hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          {/* Course Header with Image */}
          <div className="mb-10">
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Course Image */}
                <div className="flex-shrink-0">
                  <div className="relative overflow-hidden rounded-xl border border-border bg-muted">
                    <img
                      src={`/storage/${subject.image}`}
                      alt={`${subject.title} subject title`}
                      className="w-full lg:w-80 h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                </div>

                {/* Course Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-3">{subject.title}</h1>
                    <p className="text-base text-muted-foreground max-w-4xl leading-relaxed">{subject.description}</p>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-4 pt-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span>{modules.length} Modules</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4" />
                      <span>{completedModules} Completed</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Award className="h-4 w-4" />
                      <span>Certificate Available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            {isEnrolled && availableModules.length > 0 && (
              <Card className="border border-border bg-card shadow-sm">
                <CardContent className="py-4 px-8">
                  <div className="flex justify-between items-center mb-8">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-card-foreground">Course Progress</h3>
                      <p className="text-muted-foreground text-sm">
                        {completedModules} of {availableModules.length} available modules completed
                      </p>
                      {disabledCount > 0 && (
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                          <p className="text-xs text-amber-600 dark:text-amber-400">
                            {disabledCount} modules currently disabled by instructor
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary mb-1">{Math.round(progress)}%</div>
                      <p className="text-xs text-muted-foreground">Complete</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Progress value={progress} className="h-3" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Started</span>
                      <span>Completed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Modules Section */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Course Content</h2>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <Badge variant="secondary" className="font-normal">
                  {availableModules.length} Available
                </Badge>
                {disabledCount > 0 && (
                  <Badge
                    variant="outline"
                    className="font-normal border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-300"
                  >
                    {disabledCount} Disabled
                  </Badge>
                )}
              </div>
            </div>

            {modules.length > 0 ? (
              <div className="space-y-4">
                {modules.map((module, index) => {
                  const isDisabled = !module.isActive
                  return (
                    <Card
                      key={module.id}
                      className={`transition-all duration-200 ${
                        isDisabled
                          ? "border-border bg-muted/30 opacity-70"
                          : module.isDone
                            ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20 hover:shadow-lg"
                            : isEnrolled
                              ? "border-border bg-card hover:border-primary/20 hover:shadow-lg"
                              : "border-border bg-card"
                      }`}
                    >
                      <CardContent className="px-6 py-4">
                        <div className="flex items-start gap-6">
                          {/* Module Status Icon */}
                          <div className="flex-shrink-0">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-semibold ${
                                isDisabled
                                  ? "bg-muted text-muted-foreground"
                                  : module.isDone
                                    ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                                    : isEnrolled
                                      ? "bg-primary/10 text-primary"
                                      : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {isDisabled ? (
                                <Lock className="h-5 w-5" />
                              ) : module.isDone ? (
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
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-2">
                                  <h3
                                    className={`font-semibold ${isDisabled ? "text-muted-foreground" : "text-card-foreground"}`}
                                  >
                                    {module.title}
                                  </h3>
                                  {isDisabled && (
                                    <Badge
                                      variant="outline"
                                      className="border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300"
                                    >
                                      <AlertCircle className="h-3 w-3 mr-1" />
                                      Disabled
                                    </Badge>
                                  )}
                                  {module.isDone && (
                                    <Badge
                                      variant="outline"
                                      className="border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                                    >
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Completed
                                    </Badge>
                                  )}
                                </div>

                                <p
                                  className={`text-sm leading-relaxed ${isDisabled ? "text-muted-foreground/70" : "text-muted-foreground"}`}
                                >
                                  {module.description}
                                </p>

                                {/* Module Meta */}
                                <div
                                  className={`flex items-center gap-6 text-sm ${isDisabled ? "text-muted-foreground/70" : "text-muted-foreground"}`}
                                >
                                  {module.type && (
                                    <div className="flex items-center gap-2">
                                      {getModuleIcon(module.type)}
                                      <span className="capitalize font-medium">{module.type}</span>
                                    </div>
                                  )}
                                  {module.lessons && (
                                    <div className="flex items-center gap-2">
                                      <BookOpen className="h-3 w-3" />
                                      <span>{module.lessons} lessons</span>
                                    </div>
                                  )}
                                </div>

                                {/* Disabled Message */}
                                {isDisabled && (
                                  <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-amber-700 dark:text-amber-300">
                                      This module has been temporarily disabled by your instructor and will become
                                      available when enabled.
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-2 flex-shrink-0 flex-col">
                                {isEnrolled && !isDisabled && (
                                  <Button
                                    size="default"
                                    variant={module.isDone ? "outline" : "default"}
                                    className="min-w-[100px]"
                                    onClick={() => handleDownloadPdf(module.id)}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                )}
                                {isDisabled && (
                                  <Button size="default" variant="ghost" disabled className="min-w-[100px]">
                                    Unavailable
                                  </Button>
                                )}
                                {!module.isDone && !isDisabled && (
                                  <Button 
                                    variant="ghost" 
                                    className="text-xs text-muted-foreground"
                                    onClick={() => handleModuleDone(module.id)}
                                  >
                                    mark as complete
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card className="border border-border bg-card">
                <CardContent className="text-center py-16">
                  <BookOpen className="mx-auto h-16 w-16 text-muted-foreground/50 mb-6" />
                  <h3 className="text-xl font-semibold mb-3 text-card-foreground">No modules available</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    There are no modules for this subject in your course. Check back later or contact your instructor.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Info Card for Disabled Modules */}
          {disabledCount > 0 && (
            <Card className="mt-8 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" />
                  <div className="space-y-2">
                    <h4 className="text-base font-semibold text-amber-800 dark:text-amber-200">
                      Some modules are currently disabled
                    </h4>
                    <p className="text-amber-700 dark:text-amber-300 leading-relaxed text-sm">
                      Your instructor has temporarily disabled {disabledCount} module{disabledCount !== 1 ? "s" : ""}{" "}
                      for your section. These will become available when your instructor enables them. You can continue
                      with the available modules in the meantime.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Completion Card */}
          {isEnrolled && availableModules.length > 0 && progress < 100 && (
            <Card className="mt-10 border border-border bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5">
              <CardContent className="p-8 text-center">
                <div className="max-w-lg mx-auto space-y-6">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-card-foreground">
                      Complete your course to earn a certificate
                    </h3>
                    <p className="text-muted-foreground">
                      You're making great progress! Complete all available modules to earn your course completion
                      certificate.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-muted-foreground">
                      {completedModules} of {availableModules.length} available modules completed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </HeaderLayout>
  )
}