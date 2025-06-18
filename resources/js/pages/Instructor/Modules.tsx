"use client"

import { useEffect, useState } from "react"
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
import { BookOpen, Plus, MoreHorizontal, Search, Download, Grid3X3, List, X, Calendar, Menu, CheckCircle, FileText } from "lucide-react"
import HeaderLayout from "@/layouts/header-layout"
import { Head, router } from "@inertiajs/react"
import AssessmentManager from "@/components/tab/assessment-manager"
import { 
  InstructorAccessabilityProps,
  ModuleAccess,
  AssessmentList,
  AssessmentAssignment,
  Question 
} from "@/types/utils/instructor-accessability-types";


type ViewType = "modules" | "assessments"

export default function Modules({ modules, classInstructor, assessments, assignments }: InstructorAccessabilityProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [moduleAccesses, setModuleAccesses] = useState<ModuleAccess[]>(modules)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentView, setCurrentView] = useState<ViewType>("modules")

  useEffect(() => {
    console.log("Assignments: ", assignments)
  },[])

  const filteredModules = moduleAccesses.filter((moduleAccess) => {
    const module = moduleAccess.module
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) || module.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAvailability = availabilityFilter === "all" || (availabilityFilter === "available" && moduleAccess.is_available) || (availabilityFilter === "unavailable" && !moduleAccess.is_available)
    return matchesSearch && matchesAvailability
  })

  const handleToggleAvailability = async (moduleAccessId: number, currentStatus: boolean) => {
    try {
      setModuleAccesses((prev) => prev.map((ma) => (ma.id === moduleAccessId ? { ...ma, is_available: !currentStatus } : ma)))
    } catch (error) {
      setModuleAccesses((prev) => prev.map((ma) => (ma.id === moduleAccessId ? { ...ma, is_available: currentStatus } : ma)))
      console.error("Failed to update module availability:", error)
    }
  }

  const availableCount = moduleAccesses.filter((ma) => ma.is_available).length
  const totalCount = moduleAccesses.length
  const availableAssessments = assignments.filter((a) => a.is_available).length
  const totalAssessments = assignments.length
  const clearFilters = () => { setSearchTerm(""); setAvailabilityFilter("all") }
  const hasActiveFilters = searchTerm !== "" || availabilityFilter !== "all"

  const changeAccess = async (id: number) => {
    router.post(route("instructor.moduleAvailability", id), {}, {
      onSuccess: () => console.log("success"),
      onError: (errors) => console.error("Error occurred", errors)
    })
  }

  const getProgressData = () => currentView === "modules" ? {
    current: availableCount, 
    total: totalCount, 
    label: "Module Progress",
     description: "modules available"
  } : {
    current: availableAssessments, 
    total: totalAssessments, 
    label: "Assessment Progress", 
    description: "assessments available"
  }

  const progressData = getProgressData()

  const renderModulesView = () => (
    <div className="flex flex-col h-full">
      <Head title={"Modules"} />
      {/* Fixed filter header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 sticky top-0 z-10">
        <div className="flex items-center gap-4 ">
          <div className=" flex-1 max-w-md relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4" />
            <Input placeholder="Search modules..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 border-slate-200 dark:border-slate-600" />
          </div>
          <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
            <SelectTrigger className="w-[160px] border-slate-200 dark:border-slate-600"><SelectValue placeholder="Filter by status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters} className="border-slate-200 dark:border-slate-600">
              <X className="h-4 w-4 mr-1" /> Clear
            </Button>
          )}
          <div className="flex items-center border border-slate-200 dark:border-slate-600 rounded-lg p-1 bg-slate-50 dark:bg-slate-700">
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")} className="h-8 px-3"><List className="h-4 w-4" /></Button>
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className="h-8 px-3"><Grid3X3 className="h-4 w-4" /></Button>
          </div>
        </div>
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <span className="text-sm text-slate-500 dark:text-slate-400">Filters:</span>
            {searchTerm && <Badge variant="secondary" className="text-xs bg-slate-100 dark:bg-slate-700">"{searchTerm}"</Badge>}
            {availabilityFilter !== "all" && <Badge variant="secondary" className="text-xs bg-slate-100 dark:bg-slate-700">{availabilityFilter}</Badge>}
            <span className="text-sm text-slate-500 dark:text-slate-400">({filteredModules.length} results)</span>
          </div>
        )}
      </div>

      {/* Scrollable content */}
      <Card className="flex-1 overflow-auto m-4 p-4 ">
        {filteredModules.length > 0 ? viewMode === "list" ? (
          <div className="space-y-3">
            {filteredModules.map((moduleAccess) => (
              <Card key={moduleAccess.id} className="hover:shadow-md transition-all duration-200 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-lg flex items-center justify-center shadow-sm">
                        <span className="text-lg font-bold text-slate-600 dark:text-slate-300">{moduleAccess.module.order}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold truncate text-slate-900 dark:text-slate-100">{moduleAccess.module.title}</h3>
                          <Badge variant={moduleAccess.is_available ? "default" : "secondary"} className={`text-xs ${moduleAccess.is_available ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300"}`}>
                            {moduleAccess.is_available ? "Available" : "Unavailable"}
                          </Badge>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 line-clamp-2 text-xs">{moduleAccess.module.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3 w-28">
                        <Switch checked={moduleAccess.is_available} onCheckedChange={() => { changeAccess(moduleAccess.id); handleToggleAvailability(moduleAccess.id, moduleAccess.is_available) }} className="data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:bg-emerald-500" />
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">{moduleAccess.is_available ? "Available" : "Unavailable"}</Label>
                      </div>
                      <div className="flex items-center gap-1">
                        {moduleAccess.module.pdf && <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"><Download className="h-4 w-4" /></Button>}
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"><MoreHorizontal className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((moduleAccess) => (
              <Card key={moduleAccess.id} className="hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-lg flex items-center justify-center shadow-sm">
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{moduleAccess.module.order}</span>
                      </div>
                      <Badge variant={moduleAccess.is_available ? "default" : "secondary"} className={`text-xs ${moduleAccess.is_available ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300"}`}>
                        {moduleAccess.is_available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"><MoreHorizontal className="h-4 w-4" /></Button>
                  </div>
                  <CardTitle className="text-lg text-slate-900 dark:text-slate-100">{moduleAccess.module.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-sm line-clamp-2 text-slate-600 dark:text-slate-400">{moduleAccess.module.description}</CardDescription>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <Switch checked={moduleAccess.is_available} onCheckedChange={() => { changeAccess(moduleAccess.id); handleToggleAvailability(moduleAccess.id, moduleAccess.is_available) }} className="data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:bg-emerald-500" />
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Available</Label>
                    </div>
                    <div className="flex items-center gap-1">
                      {moduleAccess.module.pdf && <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"><Download className="h-4 w-4" /></Button>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <CardContent className="py-16">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center"><BookOpen className="w-8 h-8 text-slate-400" /></div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No modules found</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">{hasActiveFilters ? "No modules match your current filters." : "Get started by creating your first module."}</p>
                </div>
                {!hasActiveFilters && <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"><Plus className="w-4 h-4 mr-2" />Create Module</Button>}
              </div>
            </CardContent>
          </Card>
        )}
      </Card>
      
    </div>
  )

  const renderAssessmentsView = () => <AssessmentManager modules={modules} classInstructor={classInstructor} assessments={assessments} assignments={assignments}/>

  return (
    <HeaderLayout>
      <div className="min-h-[calc(100vh-4rem)] mt-16">
        <div className="flex h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-900">
          <div className={`${sidebarOpen ? "w-80" : "w-16"} transition-all duration-300 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shadow-sm`}>
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"><Menu className="h-4 w-4" /></Button>
              </div>
            </div>
            {sidebarOpen && (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-slate-200 dark:border-slate-600">
                    <AvatarFallback className="bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-300 dark:to-slate-100 text-white dark:text-slate-900 font-bold">{classInstructor.subject.code.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-slate-900 dark:text-slate-100 truncate">{classInstructor.subject.code}</h2>
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{progressData.label}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{progressData.current}/{progressData.total}</span>
                  </div>
                  <Progress value={(progressData.current / progressData.total) * 100} className="h-2" />
                  <div className="text-xs text-slate-500 dark:text-slate-400">{Math.round((progressData.current / progressData.total) * 100)}% {progressData.description}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className={`${progressData.current != 0 ? 'bg-emerald-50 dark:bg-emerald-900/20': 'bg-slate-50 dark:bg-slate-700/50'} p-3 rounded-lg`}>
                    <div className={`flex items-center gap-2 ${progressData.current != 0 ? 'text-emerald-600 dark:text-emerald-400': 'text-slate-600 dark:text-slate-400'}`}>
                      <CheckCircle className={`h-4 w-4`} />
                      <div>
                        <div className={`text-xs`}>{currentView === "modules" ? "Available" : "Active"}</div>
                        <div className="font-bold ">{progressData.current}</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      {currentView === "modules" ? <BookOpen className="h-4 w-4 text-slate-600 dark:text-slate-400" /> : <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400" />}
                      <div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Total</div>
                        <div className="font-bold text-slate-700 dark:text-slate-300">{progressData.total}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <Separator className="bg-slate-200 dark:bg-slate-700" />
                <nav className="space-y-1">
                  <Button variant={currentView === "modules" ? "default" : "ghost"} className="w-full justify-start" size="sm" onClick={() => setCurrentView("modules")}>
                    <BookOpen className="h-4 w-4 mr-2" />Modules
                  </Button>
                  <Button variant={currentView === "assessments" ? "default" : "ghost"} className="w-full justify-start" size="sm" onClick={() => setCurrentView("assessments")}>
                    <FileText className="h-4 w-4 mr-2" />Assessments
                  </Button>
                </nav>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{currentView === "modules" ? "Modules" : "Assessments"}</h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">{currentView === "modules" ? "Manage course modules and availability" : "Create and manage assessments for your course"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs border-slate-300 dark:border-slate-600"><Calendar className="h-3 w-3 mr-1" />{classInstructor.subject.semester}</Badge>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              {currentView === "modules" ? renderModulesView() : renderAssessmentsView()}
            </div>
          </div>
        </div>
      </div>
    </HeaderLayout>
  )
}