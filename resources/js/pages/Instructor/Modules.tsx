import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  BookOpen,
  Users,
  Plus,
  MoreHorizontal,
  TrendingUp,
  CheckCircle,
  Search,
  Eye,
  Download,
  Edit,
} from "lucide-react"
import HeaderLayout from "@/layouts/header-layout"
import { Head } from "@inertiajs/react"

interface Subject {
  id: number
  code: string
  title: string
  description: string
  year_level: string
  semester: string
  isActive: boolean
}

interface Course {
  id: number
  // whatever fields your course has
}

interface ClassInstructor {
  id: number
  course: Course
  subject: Subject
  year_level: string
  section: string
}

interface Module {
  id: number
  subject_id: number
  title: string
  description: string
  status: "published" | "draft"
  order: number
  materials?: any
  pdf?: string | null
}

interface ModuleAccess {
  id: number
  module_id: number
  class_instructor_id: number
  is_available: boolean
  module: Module
}

interface Props {
  classInstructor: ClassInstructor
  modules: ModuleAccess[]
}

export default function Modules({ modules, classInstructor }: Props) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")
  const [moduleAccesses, setModuleAccesses] = useState<ModuleAccess[]>(modules)

  // Filter modules based on search and filters
  const filteredModules = moduleAccesses.filter((moduleAccess) => {
    const module = moduleAccess.module
    const matchesSearch =
      module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || module.status === statusFilter
    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "available" && moduleAccess.is_available) ||
      (availabilityFilter === "unavailable" && !moduleAccess.is_available)

    return matchesSearch && matchesStatus && matchesAvailability
  })

  // Handle toggle module availability
  const handleToggleAvailability = async (moduleAccessId: number, currentStatus: boolean) => {
    try {
      // Update local state immediately for better UX
      setModuleAccesses((prev) =>
        prev.map((ma) => (ma.id === moduleAccessId ? { ...ma, is_available: !currentStatus } : ma)),
      )

      // Here you would make an API call to update the backend
      // await updateModuleAccess(moduleAccessId, { is_available: !currentStatus })
    } catch (error) {
      // Revert on error
      setModuleAccesses((prev) =>
        prev.map((ma) => (ma.id === moduleAccessId ? { ...ma, is_available: currentStatus } : ma)),
      )
      console.error("Failed to update module availability:", error)
    }
  }

  const availableCount = moduleAccesses.filter((ma) => ma.is_available).length
  const totalCount = moduleAccesses.length

  return (
    <HeaderLayout>
      <Head title={"Modules"} />
      <div className="min-h-screen mt-20 p-6 space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Modules</h1>
              <p className="text-muted-foreground">
                {classInstructor.subject.code} - {classInstructor.subject.title}
              </p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Module
            </Button>
          </div>

          {/* Class Information Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Subject</p>
                    <p className="text-sm text-muted-foreground">{classInstructor.subject.code}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Section</p>
                    <p className="text-sm text-muted-foreground">{classInstructor.section}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium">Year Level</p>
                    <p className="text-sm text-muted-foreground">{classInstructor.year_level}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium">Available Modules</p>
                    <p className="text-sm text-muted-foreground">
                      {availableCount} of {totalCount}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Module Availability</span>
                  <span>{Math.round((availableCount / totalCount) * 100)}%</span>
                </div>
                <Progress value={(availableCount / totalCount) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search modules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modules</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((moduleAccess) => {
            const module = moduleAccess.module
            return (
              <Card key={moduleAccess.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg leading-tight">
                        Module {module.order}: {module.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={module.status === "published" ? "default" : "secondary"} className="text-xs">
                          {module.status}
                        </Badge>
                        <Badge variant={moduleAccess.is_available ? "default" : "destructive"} className="text-xs">
                          {moduleAccess.is_available ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-sm line-clamp-3">{module.description}</CardDescription>

                  {/* Module Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`module-${moduleAccess.id}`}
                        checked={moduleAccess.is_available}
                        onCheckedChange={() => handleToggleAvailability(moduleAccess.id, moduleAccess.is_available)}
                      />
                      <Label htmlFor={`module-${moduleAccess.id}`} className="text-sm font-medium cursor-pointer">
                        {moduleAccess.is_available ? "Available" : "Unavailable"}
                      </Label>
                    </div>

                    <div className="flex items-center space-x-1">
                      {module.pdf && (
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredModules.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No modules found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== "all" || availabilityFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Get started by adding your first module"}
                </p>
                {!searchTerm && statusFilter === "all" && availabilityFilter === "all" && (
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Module
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </HeaderLayout>
  )
}
