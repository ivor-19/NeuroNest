import type React from "react"

import type { BreadcrumbItem, SharedData } from "@/types"
import { Head, router, useForm, usePage } from "@inertiajs/react"
import { useRef, useState } from "react"
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
import { Plus, Edit, Trash2, Layers, BookOpen, GraduationCap, Calendar, Search, Filter, FileText, Upload, X, Book, Loader, AlertTriangle, Unlink, Minus } from 'lucide-react';
import AppLayout from "@/layouts/app-layout"
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"

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
  year_level: string
  semester: string
  isActive: boolean
  image: string
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
  const [activeTab, setActiveTab] = useState("subjects")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const { data: subjectData, setData: setSubjectData, post: subjectPost, processing: subjectProcessing, errors: subjectErrors, reset: subjectReset,
  } = useForm({
    code: "",
    title: "",
    description: "",
    year_level: "",
    semester: "",
    isActive: "1",
    image: null,
  })

  const { data: moduleData, setData: setModuleData, post: modulePost, processing: moduleProcessing, errors: moduleErrors, reset: moduleReset,
  } = useForm({
    title: "",
    subject_id: "",
    creator_id: auth.user.id,
    status: "published",
    description: "",
    order: "",
    pdf: ""
  })

  const allModules = subjects.flatMap((subject) => subject.modules || [])

  const [imagePreview, setImagePreview] = useState(null) //image preview
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null) //edit image preview
  const [editImageFile, setEditImageFile] = useState<File | null>(null) //edit image file

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {  // Handle image selection
    const file = e.target.files?.[0];
    if (file) {
      setSubjectData('image', file as any); // Set the file in form data
      const reader = new FileReader();
      reader.onload = (e : any) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setEditImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeEditImage = () => {
    setEditImageFile(null);
    setEditImagePreview(null);
    setEditSubject({ ...editSubject!, image: '' });
  };

  const removeImage = () => { // Remove image
    setSubjectData('image', null);
    setImagePreview(null);
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    subjectPost(route("admin.addSubject"), {
      forceFormData: true, // This is important for file uploads with Inertia
      onSuccess: () => {
        toast.success(`Subject added: ${ subjectData.code}`)
        subjectReset();
        setShowAddForm(false);
        setImagePreview(null); // Reset preview
        console.log("Success: ", subjectData);
       
      },
      onError: (errors) => {
        console.error('Error occurred', errors);
      },
    });
  };

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [orderError, setOrderError] = useState(false)
  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

    router.post(route("admin.addModule"), formData, {
      onSuccess: () => {
        moduleReset();
        setShowAddForm(false);
        setPdfFile(null);
        setOrderError(false)
        toast.success('Module added successfully');
        console.log("Module added successfully!");
        router.post(route("admin.addActivity"), {
          type: "create",
          user: auth.user.name,
          action: `Created a new module`,
          details: `${moduleData.title}`
        }, {})
      },
      onError: (errors: any) => {
        console.error('Error occurred:', errors);
        setOrderError(true)
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

  const [subjectType, setSubjectType] = useState<Subject | null>(null)
  const handleDeleteSubject = async () => {
    router.delete(route('admin.deleteSubject', subjectType?.id), {
      onSuccess: () => {
        setDeleteSubjectOpen(false)
        toast.info(`Subject: ${subjectType?.code} is deleted.`)
        router.post(route("admin.addActivity"), {
          type: "delete",
          user: auth.user.name,
          action: `Delete a subject`,
          details: `${subjectType?.title}`
        }, {})
      },
      onError: (errors) => {
        console.error('Error occured', errors)
        setDeleteSubjectOpen(false)
      }
    })
  }

  const [moduleType, setModuleType] = useState<Module | null>(null)
  const confirmRemoveModule = async () => {
    router.delete(route('admin.deleteModule', moduleType?.id), {
      onSuccess: () => {
        setRemoveModuleOpen(false)
        toast.info(`Removed ${moduleType?.title}`)
        router.post(route("admin.addActivity"), {
          type: "delete",
          user: auth.user.name,
          action: `Delete a module`,
          details: `${moduleType?.title}`
        }, {})
      },
      onError: (errors) => {
        console.error('Error occured', errors)
        setRemoveModuleOpen(false)
      }
    })
  }

  const [openEditModal, setOpenEditModal] = useState(false)
  const [editSubject, setEditSubject] = useState<Subject | null>(null)
  const [editSubjectLoading, setEditSubjectLoading] = useState(false)

  const handleEditSubject = async (subject: Subject) => {
    setOpenEditModal(true)
    setEditSubject(subject)
    setEditImagePreview(subject.image ? `/storage/${subject.image}` : null)
  }

  const handleSubjectChanges = async (id: number) => {
    setEditSubjectLoading(true)
    
    const formData = new FormData();
    formData.append('code', editSubject?.code || '');
    formData.append('title', editSubject?.title || '');
    formData.append('description', editSubject?.description || '');
    formData.append('year_level', editSubject?.year_level?.toString() || '');
    formData.append('semester', editSubject?.semester || '');
    
    if (editImageFile) {
      formData.append('image', editImageFile);
    } else if (editSubject?.image === '') {
      // Explicitly send null if image was removed
      formData.append('image', '');
    }
  
    // Use POST instead of PUT for file uploads
    router.post(route('admin.updateSubject', id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onSuccess: () => {
        toast.success('Subject updated successfully')
        setEditSubject(null)
        setOpenEditModal(false)
        setEditSubjectLoading(false)
        setEditImagePreview(null)
        setEditImageFile(null)
        router.post(route("admin.addActivity"), {
          type: "edit",
          user: auth.user.name,
          action: `Updated subject`,
          details: `${editSubject?.title} modified`
        }, {})
      },
      onError: (errors) => {
        console.error(errors)
        setEditSubjectLoading(false)
        toast.success('There is a problem updating the subject. Try again.')
        setOpenEditModal(false)
      }
    })
  }

  const handleViewAllModules = (subjectCode: string) => {
    setActiveTab("modules")
    setSelectedSubject(subjectCode)
    setSearchQuery("")
  }

  const [openEditModule, setOpenEditModule] = useState(false)
  const [moduleTypes, setModuleTypes] = useState<Module>()
  // Add this state for the edit module form
  const [editPdfFile, setEditPdfFile] = useState<File | null>(null);

  // Update the handleEditModule function
  const handleEditModule = (module: Module) => {
    setOpenEditModule(true);
    setModuleTypes(module);
  };

  // Add this function to handle module updates
  const handleModuleChanges = async (id: number) => {
    setEditSubjectLoading(true);
    
    const formData = new FormData();
    formData.append('title', moduleTypes?.title || '');
    formData.append('subject_id', moduleTypes?.subject_id.toString() || '');
    formData.append('description', moduleTypes?.description || '');
    formData.append('status', moduleTypes?.status || '');
    formData.append('order', moduleTypes?.order.toString() || '');
    
    if (editPdfFile) {
      formData.append('pdf', editPdfFile);
    }

    console.log(moduleTypes)
    
    router.post(route('admin.updateModule', id), formData, {
      onSuccess: () => {
        toast.success('Module updated successfully');
        setOpenEditModule(false);
        setEditSubjectLoading(false);
        setEditPdfFile(null);
        router.post(route("admin.addActivity"), {
          type: "edit",
          user: auth.user.name,
          action: `Updated module`,
          details: `${moduleTypes?.title}`
        }, {});
      },
      onError: (errors) => {
        console.error(errors);
        setEditSubjectLoading(false);
        toast.error('There was a problem updating the module');
      }
    });
  };
  

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
              <Input placeholder="Search subjects and modules..." className="pl-10" value={searchQuery}  onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-2">
              <TabsList className="grid w-full grid-cols-2 ">
                <TabsTrigger value="subjects" className="flex items-center gap-2 cursor-pointer" onClick={() => setShowAddForm(false)}>
                  <BookOpen className="h-4 w-4" /> Subjects
                </TabsTrigger>
                <TabsTrigger value="modules" className="flex items-center gap-2 cursor-pointer" onClick={() => setShowAddForm(false)}>
                  <Layers className="h-4 w-4" />Modules
                </TabsTrigger>
              </TabsList>

              {/* MODULES TAB */}
              <TabsContent value="modules" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Layers className="h-5 w-5" /> Learning Modules
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">Manage and organize your course modules</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                          <SelectTrigger className="min-w-48 cursor-pointer">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Filter by subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {subjects.map((subject) => (
                              <SelectItem key={subject.code} value={subject.code}>
                                {subject.code} - {subject.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button onClick={() => setShowAddForm(!showAddForm)} className="cursor-pointer">
                          <Plus className="h-4 w-4 mr-2" />Add Module
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
                              <Input id="module-title" value={moduleData.title} onChange={(e) => setModuleData("title", e.target.value)} placeholder="Enter module title"/>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="module-subject">Subject</Label>
                              <Select value={moduleData.subject_id} onValueChange={(value) => setModuleData("subject_id", value)}>
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
                              <Textarea id="module-description" value={moduleData.description} onChange={(e) => setModuleData("description", e.target.value)} placeholder="Describe the module content and objectives" rows={3} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="module-order">Module Order</Label>
                              <Input id="module-order" type="number" value={moduleData.order} onChange={(e) => setModuleData("order", e.target.value)} placeholder="1, 2, 3..."/>
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
                              <Input  type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleAddModule} disabled={moduleProcessing} className="cursor-pointer">
                              {moduleProcessing ? "Creating..." : "Create Module"}
                            </Button>
                            <Button variant="outline" onClick={() => setShowAddForm(false)} className="cursor-pointer"> Cancel</Button>
                            {moduleErrors.title || moduleErrors.subject_id || moduleErrors.description || moduleErrors.order || moduleErrors.status || pdfFile && 
                              <p className="text-sm font-medium text-destructive">Complete all fields</p>
                            }
                            {orderError && (
                              <p className="text-sm font-medium text-destructive">
                                Order module already exists
                              </p>
                            )}
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
                                        <GraduationCap className="h-3 w-3" /> Year {subject.year_level}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" /> Semester {subject.semester}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <BookOpen className="h-3 w-3" /> {subject.title}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="sm" className="cursor-pointer" onClick={() => handleEditModule(module)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="cursor-pointer" onClick={() => {setRemoveModuleOpen(true), setModuleType(module)}}>
                                    <Trash2 className="h-4 w-4" />
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
                            {searchQuery ? "Try adjusting your search terms" : "Create your first learning module to get started"}
                          </p>
                          {!searchQuery && (
                            <Button onClick={() => setShowAddForm(true)} className="cursor-pointer">
                              <Plus className="h-4 w-4 mr-2" />  Add Module
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
                          <BookOpen className="h-5 w-5" /> Academic Subjects
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">Organize your curriculum and course structure</p>
                      </div>
                      <Button onClick={() => setShowAddForm(!showAddForm)} className="cursor-pointer">
                        <Plus className="h-4 w-4 mr-2" /> Add Subject
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
                            
                            {/* Image Upload Section */}
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="subject-image">Subject Image</Label>
                              <div className="flex items-center gap-4">
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  id="subject-image"
                                  accept="image/*"
                                  onChange={handleImageSelect}
                                  className="hidden"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="flex items-center gap-2 cursor-pointer"
                                >
                                  <Upload className="h-4 w-4" />
                                  Choose Image
                                </Button>
                                {imagePreview && (
                                  <div className="relative">
                                    <img
                                      src={imagePreview || "/placeholder.svg"}
                                      alt="Preview"
                                      className="h-16 w-16 object-cover rounded-md border"
                                    />
                                    <button
                                      type="button"
                                      onClick={removeImage}
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                )}
                              </div>
                             
                              {subjectErrors.image && (
                                <p className="text-sm font-medium text-destructive">{subjectErrors.image}</p>
                              )}
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
                                  <SelectItem value="1st">1st Semester</SelectItem>
                                  <SelectItem value="2nd">2nd Semester</SelectItem>
                                  <SelectItem value="Summer">Summer</SelectItem>
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
                            <Button onClick={handleAddSubject} disabled={subjectProcessing} className="cursor-pointer">
                              {subjectProcessing ? "Creating..." : "Create Subject"}
                            </Button>
                            <Button variant="outline" onClick={() => setShowAddForm(false)} className="cursor-pointer">
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
                          <CardContent className="p-2 flex flex-col gap-4">
                           <div className="w-full h-48 relative">
                            {subject.image ? (
                              <img
                                src={`/public/storage/${subject.image}`}
                                alt={`${subject.title} subject title`}
                                className="w-full h-full object-cover"
                              />
                            ):(
                              <div className="relative h-full rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                                <PlaceholderPattern className="w-full h-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                  No image available
                                </div>
                              </div>
                            )}
                             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                            <div className="px-2">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <h3 className="font-semibold">{subject.title}</h3>
                                  <p className="text-sm text-muted-foreground">{subject.code}</p>
                                </div>                            
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={subject.isActive}
                                    onCheckedChange={(checked) => {
                                      router.post(route('admin.subjectAvailability', subject.id), {
                                        isActive: checked
                                      }, {
                                        onSuccess: () => {
                                          toast.success(`Subject status updated`);
                                        },
                                        onError: (errors) => {
                                          console.error('Error updating status', errors);
                                        }
                                      });
                                    }}
                                    className="data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:bg-emerald-500 cursor-pointer"
                                  />
                                 
                                  <Button variant="ghost" size="sm" className="cursor-pointer" onClick={() => handleEditSubject(subject)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="cursor-pointer" onClick={() => {setDeleteSubjectOpen(true), setSubjectType(subject)}}>
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
                                <div 
                                  className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer hover:text-primary transition-colors" 
                                  onClick={() => handleViewAllModules(subject.code)}
                                > 
                                  View all 
                                </div>
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
                          {searchQuery ? "Try adjusting your search terms" : "Create your first subject to start building your curriculum"}
                        </p>
                        {!searchQuery && (
                          <Button onClick={() => setShowAddForm(true)} className="cursor-pointer">
                            <Plus className="h-4 w-4 mr-2" /> Add Subject
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
       
        <AlertDialog open={openEditModal} onOpenChange={setOpenEditModal}>
          <AlertDialogContent className="sm:max-w-[500px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Edit Subject
              </AlertDialogTitle>
            </AlertDialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-code">Code</Label>
                <Input
                  id="subjectCode"
                  value={editSubject?.code || ""}
                  onChange={(e) => setEditSubject({ ...editSubject!, code: e.target.value })}
                  placeholder="Enter course code"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-name">Title</Label>
                <Input
                  id="subjectTitle"
                  value={editSubject?.title || ""}
                  onChange={(e) => setEditSubject({ ...editSubject!, title: e.target.value })}
                  placeholder="Enter course name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="subjectDescription"
                  value={editSubject?.description || ""}
                  onChange={(e) => setEditSubject({ ...editSubject!, description: e.target.value })}
                  placeholder="Enter course description"
                />
              </div>
            </div>
            
            {/* Image Upload Section for Edit */}
            <div className="space-y-2">
              <Label>Subject Image</Label>
              <div className="flex items-center gap-4">
                <input
                  ref={editFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => editFileInputRef.current?.click()}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  Change Image
                </Button>
                {editImagePreview && (
                  <div className="relative">
                    <img
                      src={editImagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="h-16 w-16 object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={removeEditImage}
                      className="cursor-pointer absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
              {!editImagePreview && editSubject?.image && (
                <div className="relative mt-2">
                  <img
                    src={`/public/storage/${editSubject.image}`}
                    alt="Current subject image"
                    className="h-16 w-16 object-cover rounded-md border"
                  />
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="edit-status">Year Level</Label>
                <Select
                  value={editSubject?.year_level.toString()}
                  onValueChange={(value) => {
                    setEditSubject({
                      ...editSubject!,
                      year_level: value,
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Year Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Semester</Label>
                <Select
                  value={editSubject?.semester}
                  onValueChange={(value) => {
                    setEditSubject({
                      ...editSubject!,
                      semester: value,
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st">1st</SelectItem>
                    <SelectItem value="2nd">2nd</SelectItem>
                    <SelectItem value="Summer">Summmer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpenEditModal(false)} className="cursor-pointer">
                Cancel
              </Button>
              <Button onClick={() => handleSubjectChanges(editSubject!.id)} disabled={editSubjectLoading} className="cursor-pointer">
                {editSubjectLoading ? (
                  <div className="flex items-center gap-2">
                    Saving <Loader className="animate-spin h-4 w-4"/>
                  </div>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={openEditModule} onOpenChange={setOpenEditModule}>
          <AlertDialogContent className="sm:max-w-[500px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Edit Module
              </AlertDialogTitle>
            </AlertDialogHeader>

            <div className="space-y-4 p-6 border rounded-lg bg-muted/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="module-title">Module Title</Label>
                  <Input
                    id="moduleTitle"
                    value={moduleTypes?.title || ""}
                    onChange={(e) => setModuleTypes({ ...moduleTypes!, title: e.target.value })}
                    placeholder="Enter module title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Subject</Label>
                  <Select
                    value={moduleTypes?.subject_id.toString()}
                    onValueChange={(value) => {
                      setModuleTypes({
                        ...moduleTypes!,
                        subject_id: Number(value),
                      })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subject" />
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
                    id="moduleTitle"
                    value={moduleTypes?.description || ""}
                    onChange={(e) => setModuleTypes({ ...moduleTypes!, description: e.target.value })}
                    placeholder="Describe the module content and objectives" 
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="module-order">Module Order</Label>
                  <Input
                    id="moduleTitle"
                    value={moduleTypes?.order || ""}
                    onChange={(e) => setModuleTypes({ ...moduleTypes!, order: Number(e.target.value) })}
                    placeholder="1, 2, 3..."
                    type="number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="module-status">Status</Label>
                  <Select
                    value={moduleTypes?.status}
                    onValueChange={(value) => {
                      setModuleTypes({
                        ...moduleTypes!,
                        status: value,
                      })
                    }}
                  >
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
                    onChange={(e) => setEditPdfFile(e.target.files?.[0] || null)} 
                  />
                  {moduleTypes?.pdf && !editPdfFile && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      Current file: {moduleTypes.pdf.split('/').pop()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpenEditModule(false)} className="cursor-pointer">
                Cancel
              </Button>
              <Button 
                onClick={() => handleModuleChanges(moduleTypes!.id)} 
                disabled={editSubjectLoading}
                className="cursor-pointer"
              >
                {editSubjectLoading ? (
                  <div className="flex items-center gap-2">
                    Saving <Loader className="animate-spin h-4 w-4"/>
                  </div>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        
        <AlertDialog open={deleteSubjectOpen} onOpenChange={setDeleteSubjectOpen}>
          <AlertDialogContent className="max-w-md">
          <AlertDialogHeader className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full dark:bg-red-900/20 flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <AlertDialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Delete Subject
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                  Are you absolutely sure you want to delete this subject?
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <div className="my-4">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800/30 dark:bg-red-900/10">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  </div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">This action cannot be undone</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    This will permanently remove all associated data and relationships
                  </p>
                  
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    All modules associated with this subject will also get deleted
                  </p>
                  
                </div>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel className="flex-1 sm:flex-none">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSubject}
              className="flex-1 sm:flex-none bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-600 dark:hover:bg-red-700 gap-2 font-medium"
            >
              <Trash2 className="h-4 w-4" />
              Delete Subject
            </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={removeModuleOpen} onOpenChange={setRemoveModuleOpen}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full dark:bg-amber-900/20 flex-shrink-0">
                  <Unlink className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>

                <div className=" flex-1">
                  <AlertDialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {`Remove module from a subject?`}
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                    This will remove the module from the subject. The module itself will not be deleted.
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>

            <div className="my-4">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/30 dark:bg-amber-900/10">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                    </div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                     {`${moduleType?.title} will be unlinked from this subject`}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                    </div>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      You can re-add the module to this subject later if needed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <AlertDialogFooter className="gap-2 sm:gap-2">
              <AlertDialogCancel className="flex-1 sm:flex-none">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmRemoveModule}
                className="flex-1 sm:flex-none bg-amber-600 text-white hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:bg-amber-600 dark:hover:bg-amber-700 gap-2 font-medium"
              >
                <Unlink className="h-4 w-4" />
                Remove Module
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  )
}