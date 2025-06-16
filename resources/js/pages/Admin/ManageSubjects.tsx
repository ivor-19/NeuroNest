"use client"

import type React from "react"

import type { BreadcrumbItem, SharedData } from "@/types"
import { Head, router, useForm, usePage } from "@inertiajs/react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import {
  Plus,
  Edit,
  Trash2,
  Layers,
  BookOpen,
  GraduationCap,
  Calendar,
  Search,
  Filter,
  FileText,
  Users,
  MoreHorizontal,
} from "lucide-react"
import AppLayout from "@/layouts/app-layout"
import { route } from "ziggy-js"

type Module = {
  id: number
  subject_id: number
  title: string
  description: string
  status: string
  order: number
  materials: string[]
  pdf: string
}

type Subject = {
  id: number
  code: string
  title: string
  description: string
  year_level: number
  semester: string
  isActive: number
  modules?: Module[]
}

type SubjectProps = {
  subjects: Subject[]
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Manage Students",
    href: "admin/manage-subjects",
  },
]

export default function ManageSubjects({ subjects }: SubjectProps) {
  const {auth} = usePage<SharedData>().props
  const [activeTab, setActiveTab] = useState("modules")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  const {
    data: subjectData,
    setData: setSubjectData,
    post: subjectPost,
    processing: subjectProcessing,
    errors: subjectErrors,
    reset: subjectReset,
  } = useForm({
    code: "",
    title: "",
    description: "",
    year_level: "",
    semester: "",
    isActive: "",
  })

  const {
    data: moduleData,
    setData: setModuleData,
    post: modulePost,
    processing: moduleProcessing,
    errors: moduleErrors,
    reset: moduleReset,
  } = useForm({
    title: "",
    subject_id: "",
    creator_id: auth.user.id,
    status: "",
    description: "",
    order: "",
  })

  const allModules = subjects.flatMap((subject) => subject.modules || [])

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault()
    subjectPost(route("admin.addSubject"), {
      onSuccess: () => {
        subjectReset()
        setShowAddForm(false)
        console.log("Success: ", subjectData)
      },
      onError: (errors) => {
        console.error('Error occured', errors)
      },
    })
  }

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create FormData
    const formData = new FormData();
    
    formData.append('subject_id', moduleData.subject_id);
    formData.append('creator_id', auth.user.id.toString());
    formData.append('title', moduleData.title);
    formData.append('description', moduleData.description);
    formData.append('status', moduleData.status);
    formData.append('order', moduleData.order);
    
    if (pdfFile) {
      formData.append('pdf', pdfFile);
    }

    // Use Inertia router directly
    router.post(route("admin.addModule"), formData, {
      onSuccess: () => {
        moduleReset();
        setShowAddForm(false);
        setPdfFile(null);
        console.log("Module added successfully!");
      },
      onError: (errors: any) => {
        console.error('Error occurred:', errors);
      },
    });
  };

  const getModulesBySubject = (subjectCode: string) => {
    if (subjectCode === "all") return allModules
    const subject = subjects.find((s) => s.code === subjectCode)
    return subject ? subject.modules || [] : []
  }

  const filteredModules = getModulesBySubject(selectedSubject).filter((module) =>
    module.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Stats calculations
  const totalModules = allModules.length
  const publishedModules = allModules.filter((m) => m.status === "published").length
  const activeSubjects = subjects.filter((s) => s.isActive).length


  const [removeModuleOpen, setRemoveModuleOpen] = useState(false)
  const [deleteSubjectOpen, setDeleteSubjectOpen] = useState(false)

  const [subjectId, setSubjectId] = useState(0)
  const handleDeleteSubject = async () => {
    router.delete(route('admin.deleteSubject', subjectId), {
      onSuccess: () => {
        setDeleteSubjectOpen(false)
      },
      onError: (errors) => {
        console.error('Error occured', errors)
        setDeleteSubjectOpen(false)
      }
    })
  }

  const [moduleId, setModuleId] = useState(0)
  const confirmRemoveModule = async () => {
    router.delete(route('admin.deleteModule', moduleId), {
      onSuccess: () => {
        setRemoveModuleOpen(false)
      },
      onError: (errors) => {
        console.error('Error occured', errors)
        setRemoveModuleOpen(false)
      }
    })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Subject Management" />
      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl overflow-x-auto p-8 bg-[var(--bg-main)]">
        {/* Header Section */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Subject Management</h1>
          <p className="text-muted-foreground">Manage your academic subjects and learning modules efficiently.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Active Subjects</p>
                  <p className="text-2xl font-bold">{activeSubjects}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Total Modules</p>
                  <p className="text-2xl font-bold">{totalModules}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Published</p>
                  <p className="text-2xl font-bold">{publishedModules}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subjects and modules..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-2">
              <TabsList className="grid w-full grid-cols-2 bg-[var(--bg-main-2)]">
                <TabsTrigger value="modules" className="flex items-center gap-2" onClick={() => setShowAddForm(false)}>
                  <Layers className="h-4 w-4" />
                  Modules
                </TabsTrigger>
                <TabsTrigger value="subjects" className="flex items-center gap-2" onClick={() => setShowAddForm(false)}>
                  <BookOpen className="h-4 w-4" />
                  Subjects
                </TabsTrigger>
              </TabsList>

              {/* MODULES TAB */}
              <TabsContent value="modules" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Layers className="h-5 w-5" />
                          Learning Modules
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">Manage and organize your course modules</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                          <SelectTrigger className="min-w-48">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Filter by subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Subjects</SelectItem>
                            {subjects.map((subject) => (
                              <SelectItem key={subject.code} value={subject.code}>
                                {subject.code} - {subject.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button onClick={() => setShowAddForm(!showAddForm)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Module
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Add Module Form */}
                    {showAddForm && (
                      <>
                        <div className="space-y-4 p-6 border rounded-lg bg-muted/50">
                          <div className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            <h3 className="font-semibold">Add New Module</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="module-title">Module Title</Label>
                              <Input
                                id="module-title"
                                value={moduleData.title}
                                onChange={(e) => setModuleData("title", e.target.value)}
                                placeholder="Enter module title"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="module-subject">Subject</Label>
                              <Select
                                value={moduleData.subject_id}
                                onValueChange={(value) => setModuleData("subject_id", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select subject" />
                                </SelectTrigger>
                                <SelectContent>
                                  {subjects.map((subject) => (
                                    <SelectItem key={subject.id} value={String(subject.id)}>
                                      {subject.code} - {subject.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="module-description">Description</Label>
                              <Textarea
                                id="module-description"
                                value={moduleData.description}
                                onChange={(e) => setModuleData("description", e.target.value)}
                                placeholder="Describe the module content and objectives"
                                rows={3}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="module-order">Module Order</Label>
                              <Input
                                id="module-order"
                                type="number"
                                value={moduleData.order}
                                onChange={(e) => setModuleData("order", e.target.value)}
                                placeholder="1, 2, 3..."
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="module-status">Status</Label>
                              <Select value={moduleData.status} onValueChange={(value) => setModuleData("status", value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="published">Published</SelectItem>
                                  <SelectItem value="draft">Draft</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="module-file">PDF File</Label>
                              <Input 
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleAddModule} disabled={moduleProcessing}>
                              {moduleProcessing ? "Creating..." : "Create Module"}
                            </Button>
                            <Button variant="outline" onClick={() => setShowAddForm(false)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                        <Separator />
                      </>
                    )}

                    {/* Modules List */}
                    <div className="space-y-4">
                      {filteredModules.length > 0 ? (
                        filteredModules.map((module) => {
                          const subject = subjects.find((s) => s.id === module.subject_id)
                          return (
                            <div key={module.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                              <div className="flex items-start justify-between">
                                <div className="space-y-2 flex-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">{module.title}</h3>
                                    {subject && <Badge variant="outline">{subject.code}</Badge>}
                                    <Badge variant="secondary">Module {module.order}</Badge>
                                    <Badge variant={module.status === "published" ? "default" : "secondary"}>
                                      {module.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{module.description}</p>
                                  {subject && (
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                      <span className="flex items-center gap-1">
                                        <GraduationCap className="h-3 w-3" />
                                        Year {subject.year_level}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        Semester {subject.semester}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <BookOpen className="h-3 w-3" />
                                        {subject.title}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => {setRemoveModuleOpen(true), setModuleId(module.id)}}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <div className="text-center py-12">
                          <Layers className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No modules found</h3>
                          <p className="text-muted-foreground mb-4">
                            {searchQuery
                              ? "Try adjusting your search terms"
                              : "Create your first learning module to get started"}
                          </p>
                          {!searchQuery && (
                            <Button onClick={() => setShowAddForm(true)}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Module
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SUBJECTS TAB */}
              <TabsContent value="subjects" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          Academic Subjects
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">Organize your curriculum and course structure</p>
                      </div>
                      <Button onClick={() => setShowAddForm(!showAddForm)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Subject
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Add Subject Form */}
                    {showAddForm && (
                      <>
                        <div className="space-y-4 p-6 border rounded-lg bg-muted/50">
                          <div className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            <h3 className="font-semibold">Add New Subject</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="subject-code">Subject Code</Label>
                              <Input
                                id="subject-code"
                                value={subjectData.code}
                                onChange={(e) => setSubjectData("code", e.target.value)}
                                placeholder="e.g. CS101, MATH201"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="subject-title">Subject Title</Label>
                              <Input
                                id="subject-title"
                                value={subjectData.title}
                                onChange={(e) => setSubjectData("title", e.target.value)}
                                placeholder="Enter subject title"
                              />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="subject-description">Description</Label>
                              <Textarea
                                id="subject-description"
                                value={subjectData.description}
                                onChange={(e) => setSubjectData("description", e.target.value)}
                                placeholder="Describe the subject objectives and content"
                                rows={3}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="subject-year">Year Level</Label>
                              <Select
                                value={subjectData.year_level}
                                onValueChange={(value) => setSubjectData("year_level", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1st Year</SelectItem>
                                  <SelectItem value="2">2nd Year</SelectItem>
                                  <SelectItem value="3">3rd Year</SelectItem>
                                  <SelectItem value="4">4th Year</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="subject-semester">Semester</Label>
                              <Select
                                value={subjectData.semester}
                                onValueChange={(value) => setSubjectData("semester", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select semester" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1st Semester</SelectItem>
                                  <SelectItem value="2">2nd Semester</SelectItem>
                                  <SelectItem value="3">Summer</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="subject-status">Status</Label>
                              <Select
                                value={subjectData.isActive}
                                onValueChange={(value) => setSubjectData("isActive", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">Active</SelectItem>
                                  <SelectItem value="0">Inactive</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex gap-2 items-center">
                            <Button onClick={handleAddSubject} disabled={subjectProcessing}>
                              {subjectProcessing ? "Creating..." : "Create Subject"}
                            </Button>
                            <Button variant="outline" onClick={() => setShowAddForm(false)}>
                              Cancel
                            </Button>
                            {subjectErrors.code && (
                              <p className="text-sm font-medium text-destructive">{subjectErrors.code}</p>
                            )}
                            {(subjectErrors.code || subjectErrors.title || subjectErrors.year_level || subjectErrors.semester || subjectErrors.isActive) && (
                              <p className="text-sm font-medium text-destructive">Complete all fields</p>
                            )}
                          
                          </div>
                        </div>
                        <Separator />
                      </>
                    )}

                    {/* Subjects List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredSubjects.map((subject) => (
                        <Card key={subject.id} className="hover:bg-muted/50 transition-colors">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="space-y-1">
                                <h3 className="font-semibold">{subject.title}</h3>
                                <p className="text-sm text-muted-foreground">{subject.code}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => {setDeleteSubjectOpen(true), setSubjectId(subject.id)}}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground mb-4">{subject.description}</p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">Year {subject.year_level}</Badge>
                                <Badge variant="outline">Sem {subject.semester}</Badge>
                                <Badge variant={subject.isActive ? "default" : "secondary"}>
                                  {subject.isActive ? "Active" : "Inactive"}
                                </Badge>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <BookOpen className="h-4 w-4" />
                                  {(subject.modules || []).length} modules
                                </div>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer">
                                View all
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {filteredSubjects.length === 0 && (
                      <div className="text-center py-12">
                        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No subjects found</h3>
                        <p className="text-muted-foreground mb-4">
                          {searchQuery
                            ? "Try adjusting your search terms"
                            : "Create your first subject to start building your curriculum"}
                        </p>
                        {!searchQuery && (
                          <Button onClick={() => setShowAddForm(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Subject
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <AlertDialog open={removeModuleOpen} onOpenChange={setRemoveModuleOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove module from subject?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove the module from a subject. 
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmRemoveModule}>Remove</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={deleteSubjectOpen} onOpenChange={setDeleteSubjectOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this subject?</AlertDialogTitle>
              <AlertDialogDescription>
                This will affect other data. Delete it anyway? 
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteSubject}>Remove</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  )
}
