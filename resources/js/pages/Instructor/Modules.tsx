import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  BookOpen,
  Plus,
  MoreHorizontal,
  Search,
  Eye,
  Download,
  Edit,
  Grid3X3,
  List,
  Users,
  X,
  Calendar,
  Settings,
  Menu,
  Home,
  BarChart3,
  CheckCircle,
} from "lucide-react"
import HeaderLayout from "@/layouts/header-layout"
import { Head, router } from "@inertiajs/react"

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
  const [availabilityFilter, setAvailabilityFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [moduleAccesses, setModuleAccesses] = useState<ModuleAccess[]>(modules)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Filter modules based on search and filters
  const filteredModules = moduleAccesses.filter((moduleAccess) => {
    const module = moduleAccess.module
    const matchesSearch =
      module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "available" && moduleAccess.is_available) ||
      (availabilityFilter === "unavailable" && !moduleAccess.is_available)

    return matchesSearch && matchesAvailability
  })

  // Handle toggle module availability
  const handleToggleAvailability = async (moduleAccessId: number, currentStatus: boolean) => {
    try {
      setModuleAccesses((prev) =>
        prev.map((ma) => (ma.id === moduleAccessId ? { ...ma, is_available: !currentStatus } : ma)),
      )
    } catch (error) {
      setModuleAccesses((prev) =>
        prev.map((ma) => (ma.id === moduleAccessId ? { ...ma, is_available: currentStatus } : ma)),
      )
      console.error("Failed to update module availability:", error)
    }
  }

  const availableCount = moduleAccesses.filter((ma) => ma.is_available).length
  const totalCount = moduleAccesses.length

  const clearFilters = () => {
    setSearchTerm("")
    setAvailabilityFilter("all")
  }

  const hasActiveFilters = searchTerm !== "" || availabilityFilter !== "all"

  const changeAccess = async (id: number) => {
    router.post(route('instructor.moduleAvailability', id), {}, {
      onSuccess: () => {
          console.log('success')
      },
      onError: (errors) => {
          console.error('Error occurred', errors)
      }
    })
  }

  return (
    <HeaderLayout>
      <Head title={'Dashboard'} />
      <div className="min-h-screen mt-16">
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
          {/* Sidebar */}
          <div
            className={`${
              sidebarOpen ? "w-80" : "w-16"
            } transition-all duration-300 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shadow-sm`}
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <Menu className="h-4 w-4" />
                </Button>
               
              </div>
            </div>

            {/* Course Info */}
            {sidebarOpen && (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-slate-200 dark:border-slate-600">
                    <AvatarFallback className="bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-300 dark:to-slate-100 text-white dark:text-slate-900 font-bold">
                      {classInstructor.subject.code.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {classInstructor.subject.code}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{classInstructor.subject.title}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                    <div className="text-slate-500 dark:text-slate-400 text-xs">Year Level</div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{classInstructor.year_level}</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                    <div className="text-slate-500 dark:text-slate-400 text-xs">Section</div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{classInstructor.section}</div>
                  </div>
                </div>

                <Separator className="bg-slate-200 dark:bg-slate-700" />

                {/* Stats */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Module Progress</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {availableCount}/{totalCount}
                    </span>
                  </div>
                  <Progress value={(availableCount / totalCount) * 100} className="h-2" />
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {Math.round((availableCount / totalCount) * 100)}% modules available
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <div className="text-xs text-emerald-600 dark:text-emerald-400">Available</div>
                        <div className="font-bold text-emerald-700 dark:text-emerald-300">{availableCount}</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      <div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Total</div>
                        <div className="font-bold text-slate-700 dark:text-slate-300">{totalCount}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="bg-slate-200 dark:bg-slate-700" />

                {/* Navigation */}
                <nav className="space-y-1">
                 
                  <Button variant="default" className="w-full justify-start" size="sm">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Modules
                  </Button>
                
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-slate-100 dark:hover:bg-slate-700"
                    size="sm"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Quiz
                  </Button>
                </nav>
              </div>
            )}

         
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Modules</h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">Manage course modules and availability</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs border-slate-300 dark:border-slate-600">
                    <Calendar className="h-3 w-3 mr-1" />
                    {classInstructor.subject.semester}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4" />
                  <Input
                    placeholder="Search modules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-slate-200 dark:border-slate-600"
                  />
                </div>

                {/* Filter */}
                <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                  <SelectTrigger className="w-[160px] border-slate-200 dark:border-slate-600">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modules</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="border-slate-200 dark:border-slate-600"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}

                {/* View Toggle */}
                <div className="flex items-center border border-slate-200 dark:border-slate-600 rounded-lg p-1 bg-slate-50 dark:bg-slate-700">
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-8 px-3"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8 px-3"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Filters:</span>
                  {searchTerm && (
                    <Badge variant="secondary" className="text-xs bg-slate-100 dark:bg-slate-700">
                      "{searchTerm}"
                    </Badge>
                  )}
                  {availabilityFilter !== "all" && (
                    <Badge variant="secondary" className="text-xs bg-slate-100 dark:bg-slate-700">
                      {availabilityFilter}
                    </Badge>
                  )}
                  <span className="text-sm text-slate-500 dark:text-slate-400">({filteredModules.length} results)</span>
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto p-6 bg-slate-50 dark:bg-slate-900">
              {filteredModules.length > 0 ? (
                viewMode === "list" ? (
                  <div className="space-y-3">
                    {filteredModules.map((moduleAccess) => {
                      const module = moduleAccess.module
                      return (
                        <Card
                          key={moduleAccess.id}
                          className="hover:shadow-md transition-all duration-200 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-lg flex items-center justify-center shadow-sm">
                                  <span className="text-lg font-bold text-slate-600 dark:text-slate-300">
                                    {module.order}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold truncate text-slate-900 dark:text-slate-100">
                                      {module.title}
                                    </h3>
                                    <Badge
                                      variant={moduleAccess.is_available ? "default" : "secondary"}
                                      className={`text-xs ${
                                        moduleAccess.is_available
                                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                                          : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300"
                                      }`}
                                    >
                                      {moduleAccess.is_available ? "Available" : "Unavailable"}
                                    </Badge>
                                  </div>
                                  <p className="text-slate-600 dark:text-slate-400 line-clamp-2">{module.description}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3 w-28">
                                  <Switch
                                    checked={moduleAccess.is_available}
                                    onCheckedChange={() =>{
                                      changeAccess(moduleAccess.id),
                                      handleToggleAvailability(moduleAccess.id, moduleAccess.is_available)}
                                    }
                                    className="data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:bg-emerald-500"
                                  />
                                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {moduleAccess.is_available ? "Available" : "Unavailable"}
                                  </Label>
                                </div>
                                
                                <div className="flex items-center gap-1">
                               
                                  {module.pdf && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-9 w-9 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-9 w-9 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredModules.map((moduleAccess) => {
                      const module = moduleAccess.module
                      return (
                        <Card
                          key={moduleAccess.id}
                          className="hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        >
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-lg flex items-center justify-center shadow-sm">
                                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                                    {module.order}
                                  </span>
                                </div>
                                <Badge
                                  variant={moduleAccess.is_available ? "default" : "secondary"}
                                  className={`text-xs ${
                                    moduleAccess.is_available
                                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                                      : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300"
                                  }`}
                                >
                                  {moduleAccess.is_available ? "Available" : "Unavailable"}
                                </Badge>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                            <CardTitle className="text-lg text-slate-900 dark:text-slate-100">{module.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <CardDescription className="text-sm line-clamp-2 text-slate-600 dark:text-slate-400">
                              {module.description}
                            </CardDescription>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                              <div className="flex items-center gap-3">
                                <Switch
                                  checked={moduleAccess.is_available}
                                  onCheckedChange={() =>{
                                    changeAccess(moduleAccess.id),
                                    handleToggleAvailability(moduleAccess.id, moduleAccess.is_available)}
                                  }
                                  className="data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:bg-emerald-500"
                                />
                                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Available</Label>
                              </div>

                              <div className="flex items-center gap-1">
                                {module.pdf && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )
              ) : (
                <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <CardContent className="py-16">
                    <div className="text-center space-y-4">
                      <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-slate-400" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No modules found</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                          {hasActiveFilters
                            ? "No modules match your current filters."
                            : "Get started by creating your first module."}
                        </p>
                      </div>
                      {!hasActiveFilters && (
                        <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Module
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </HeaderLayout>
  )
}
