"use client"

import AppLayout from "@/layouts/app-layout"
import { SharedData, type BreadcrumbItem } from "@/types"
import { Head, useForm, router, usePage } from "@inertiajs/react"
import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Search, Minus, Save, X, Book, PlusCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern"
import DeleteModal from "@/components/modal/delete-modal"

type CourseProps = {
  courses: {
    id: number
    name: string
    code: string
    description: string
    isActive: number
    subjects?: {
      pivotId: number
      id: number
      code: string
      title: string
      yearLevel: number
      semester: number
    }[]
  }[]
  allSubjects: {
    id: number
    code: string
    title: string
    yearLevel: number
    semester: number
  }[]
}

type Course = {
  id: number
  name: string
  code: string
  description: string
  isActive: number
  subjects?: {
    pivotId: number
    id: number
    code: string
    title: string
    yearLevel: number
    semester: number
  }[]
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Manage Courses",
    href: "admin/manageCourses",
  },
]

interface Subject {
  pivotId: number
  id: number;
  title: string;
  code?: string;
  description?: string;

}

export default function ManageCourses({ courses, allSubjects }: CourseProps) {
  const { auth } = usePage<SharedData>().props
  const [activeTab, setActiveTab] = useState("view-courses")
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null)
  const [subjectToRemove, setSubjectToRemove] = useState<number | null>(null)
  const [deleteCourseOpen, setDeleteCourseOpen] = useState(false)
  const [removeSubjectOpen, setRemoveSubjectOpen] = useState(false)

  const [curriculumChanges, setCurriculumChanges] = useState<{
    toAdd: number[]
    toRemove: number[]
  }>({ toAdd: [], toRemove: [] })
  const [hasChanges, setHasChanges] = useState(false)

  const { data, setData, post, processing, errors, reset } = useForm({
    code: "",
    name: "",
    description: "",
  })

  const getCurrentCourseSubjects = () => {
    if (!selectedCourse) return []

    const course = courses.find((c) => c.id === selectedCourse)
    const originalSubjects = course?.subjects || []

    let modifiedSubjects = originalSubjects.filter((subject) => !curriculumChanges.toRemove.includes(subject.pivotId))

    const subjectsToAdd = allSubjects
      .filter((subject) => curriculumChanges.toAdd.includes(subject.id))
      .map((subject) => ({
        ...subject,
        pivotId: 0,
      }))

    modifiedSubjects = [...modifiedSubjects, ...subjectsToAdd]
    return modifiedSubjects
  }

  const getAvailableSubjects = () => {
    if (!selectedCourse) return []
    const course = courses.find((c) => c.id === selectedCourse)
    if (!course) return allSubjects

    const originalSubjectIds = course.subjects?.map((s) => s.id) || []

    return allSubjects.filter(
      (subject) =>
        !originalSubjectIds.includes(subject.id) &&
        !curriculumChanges.toAdd.includes(subject.id) &&
        !curriculumChanges.toRemove.includes(subject.id),
    )
  }

  const addSubjectToCurriculum = (subjectId: number) => {
    setCurriculumChanges((prev) => ({
      ...prev,
      toAdd: [...prev.toAdd, subjectId],
    }))
    setHasChanges(true)
  }

  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [subjectId, setSubjectId] = useState(0)

  const handleRemoveSubject = async (subject : Subject) => {
    setRemoveSubjectOpen(true) 
    setSelectedSubject(subject)
    setSubjectId(subject.pivotId)
    console.log(subject.pivotId)
    router.post(route("admin.addActivity"), {
      type: "remove",
      user: auth.user.name,
      action: `Remove a subject`,
      details: `${selectedSubject?.title}`
    }, {})
  }


  const saveCurriculumChanges = () => {
    if (!selectedCourse || (curriculumChanges.toAdd.length === 0 && curriculumChanges.toRemove.length === 0)) {
      console.log("No course selected or no changes to save")
      return
    }

    const payload = {
      course_id: selectedCourse,
      toAdd: curriculumChanges.toAdd,
      toRemove: curriculumChanges.toRemove,
    }

    router.post(route("admin.assignSubjects"), payload, {
      onSuccess: () => {
        router.post(route("admin.addActivity"), {
          type: "assign",
          user: auth.user.name,
          action: `Assign subjects`,
          details: `${curriculumChanges?.toAdd}`
        }, {})
        setCurriculumChanges({ toAdd: [], toRemove: [] })
        setHasChanges(false)
        console.log("Curriculum updated successfully!")
        toast.success("Curriculum updated successfully!")
      },
      onError: (errors) => {
        console.error("Error saving curriculum changes:", errors)
      },
    })
  }

  const cancelCurriculumChanges = () => {
    setCurriculumChanges({ toAdd: [], toRemove: [] })
    setHasChanges(false)
  }

  const handleCourseChange = (courseId: string) => {
    if (hasChanges) {
      if (confirm("You have unsaved changes. Do you want to discard them?")) {
        setCurriculumChanges({ toAdd: [], toRemove: [] })
        setHasChanges(false)
        setSelectedCourse(Number.parseInt(courseId))
      }
    } else {
      setSelectedCourse(Number.parseInt(courseId))
    }
  }

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    post(route("admin.addCourse"), {
      onSuccess: () => {
        router.post(route("admin.addActivity"), {
          type: "create",
          user: auth.user.name,
          action: `Create new course`,
          details: `${data?.name}`
        }, {})
        reset()
        toast.success("New course has been added.")
      },
      onError: (errors) => {
        console.error("Error occured", errors)
      },
    })
  }

  const [selectedCourseType, setSelectedCourseType] = useState<Course | null>(null)
  const [deleteId, setDeleteId] = useState(0)
  const handleDeleteCourse = async (course: Course) => {
    setDeleteCourseOpen(true)
    setSelectedCourseType(course)
    setDeleteId(course.id)
    router.post(route("admin.addActivity"), {
      type: "delete",
      user: auth.user.name,
      action: `Delete a course`,
      details: `${course?.name}`
    }, {})
    console.log(course)
     
  }

  const [editCourse, setEditCourse] = useState<Course | null>(null)
  const [openEditModal, setOpenEditModal] = useState(false)

  const handleEditCourse = async (course: Course) => {
    setEditCourse(course)
    setOpenEditModal(true)
  }

  const handleSaveChanges = async (id: number) => {
    router.put(
      route("admin.updateCourse", id),
      {
        code: editCourse?.code,
        name: editCourse?.name,
        description: editCourse?.description,
        isActive: editCourse?.isActive,
      },
      {
        onSuccess: () => {
          setEditCourse(null)
          toast("Edit successfully")
          setOpenEditModal(false)
          router.post(route("admin.addActivity"), {
            type: "edit",
            user: auth.user.name,
            action: `Updated course`,
            details: `${editCourse?.name} modified`
          }, {})
        },
        onError: (errors) => {
          console.error("Error on editing course", errors)
        },
      },
    )
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Manage Students" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl overflow-x-auto p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Courses & Curriculum</h1>
            <p className="text-muted-foreground">
              Manage degree programs and their curriculum. Create courses first, then add subjects to build the
              curriculum.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 ">
              <TabsTrigger value="view-courses" className="cursor-pointer">View Courses</TabsTrigger>
              <TabsTrigger value="add-course" className="cursor-pointer">Add New Course</TabsTrigger>
              <TabsTrigger value="manage-curriculum" className="cursor-pointer">Manage Curriculum</TabsTrigger>
            </TabsList>

            <TabsContent value="view-courses" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>All Degree Programs</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search courses..." className="pl-8 w-64" />
                      </div>
                      <Button onClick={() => setActiveTab("add-course")}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Course
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4v grid grid-cols-2 gap-4">
                    {courses.map((course) => (
                      <div key={course.id} className="border rounded-lg overflow-hidden">
                        <div className="flex flex-col">
                       

                          {/* Course Content */}
                          <div className="flex-1 p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{course.name}</h3>
                                  <Badge variant="outline">{course.code}</Badge>
                                  <Badge variant="secondary">{course.subjects?.length || 0} subjects</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={course.isActive === 1 ? "default" : "secondary"}>
                                  {course.isActive === 1 ? "active" : "inactive"}
                                </Badge>
                                <Button variant="outline" size="sm" onClick={() => handleEditCourse(course)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    handleDeleteCourse(course)
                                    
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="border-t pt-3">
                              <h4 className="text-sm font-semibold mb-2">
                                Curriculum ({course.subjects?.length || 0} subjects)
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {course.subjects?.slice(0, 4).map((subject) => (
                                  <div
                                    key={subject.code}
                                    className="flex items-center justify-between p-2 bg-secondary rounded"
                                  >
                                    <div>
                                      <span className="font-medium text-sm">{subject.code}</span>
                                      <span className="text-xs text-muted-foreground ml-2">{subject.title}</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      Y{subject.yearLevel}S{subject.semester}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {course.subjects && course.subjects.length > 4 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="mt-2"
                                  onClick={() => {
                                    setSelectedCourse(course.id)
                                    setActiveTab("manage-curriculum")
                                  }}
                                >
                                  View all {course.subjects?.length} subjects →
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="add-course" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Course Program</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="code">Course Code</Label>
                        <Input
                          id="code"
                          value={data.code}
                          onChange={(e) => setData("code", e.target.value)}
                          placeholder="e.g. BSIS, BSCS"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">Course Name</Label>
                        <Input
                          id="name"
                          value={data.name}
                          onChange={(e) => setData("name", e.target.value)}
                          placeholder="e.g. Bachelor of Science in Information Systems"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        placeholder="Enter course description"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2 items-center">
                      <Button onClick={handleAddCourse}>Add Course</Button>
                      <Button variant="outline" onClick={() => setActiveTab("view-courses")}>
                        Cancel
                      </Button>
                      {errors.code && <p className="text-sm font-medium text-destructive">{errors.code}</p>}
                      {(errors.code || errors.name) && (
                        <p className="text-sm font-medium text-destructive">Complete all fields</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manage-curriculum" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Manage Course Curriculum</CardTitle>
                    {hasChanges && (
                      <div className="flex gap-2">
                        <Button
                          onClick={saveCurriculumChanges}
                          disabled={processing || curriculumChanges.toAdd.length === 0}
                          size="sm"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {processing ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button onClick={cancelCurriculumChanges} variant="outline" size="sm">
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-6">
                    <Label>Select Course to Edit</Label>
                    <Select value={selectedCourse?.toString() || ""} onValueChange={handleCourseChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id.toString()}>
                            {course.code} - {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {hasChanges && (
                    <div className="mb-4 bg-green-50 border border-green-300 p-3 dark:bg-green-900/20 dark:border-green-700/80 rounded-lg">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        You have unsaved changes.
                        {curriculumChanges.toAdd.length > 0 && ` ${curriculumChanges.toAdd.length} subject(s) to add.`}
                        {curriculumChanges.toRemove.length > 0 &&
                          ` ${curriculumChanges.toRemove.length} subject(s) to remove.`}
                      </p>
                    </div>
                  )}

                  {selectedCourse && (
                    <div className="grid gap-6 lg:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Available Subjects</CardTitle>
                          <p className="text-sm text-muted-foreground">Subjects not assigned to this course</p>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            {getAvailableSubjects().length > 0 ? (
                              getAvailableSubjects().map((subject) => (
                                <div key={subject.id} className="flex items-center justify-between p-3 border rounded">
                                  <div>
                                    <p className="font-medium text-sm">{subject.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {subject.code} • Year {subject.yearLevel} • Semester {subject.semester}
                                    </p>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => addSubjectToCurriculum(subject.id)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                All subjects are already assigned to this course.
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Current Curriculum</CardTitle>
                          <p className="text-sm text-muted-foreground">Subjects assigned to this course</p>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {getCurrentCourseSubjects().length > 0 ? (
                              getCurrentCourseSubjects().map((subject) => {
                                const isNewlyAdded = curriculumChanges.toAdd.includes(subject.id)
                                const isMarkedForRemoval = curriculumChanges.toRemove.includes(subject.pivotId)

                                return (
                                  <div
                                    key={`${subject.id}-${subject.pivotId}`} // Better key for React
                                    className={`flex items-center justify-between p-3 border rounded ${
                                      isNewlyAdded
                                        ? "border-green-300 bg-green-50 border dark:bg-green-900/20 dark:border-green-700/80"
                                        : isMarkedForRemoval
                                          ? "border-red-300 bg-red-50 opacity-50"
                                          : ""
                                    }`}
                                  >
                                    <div>
                                      <p className="font-medium text-sm ">{subject.title}</p>
                                      <p className="text-xs ">
                                        {subject.code} • Year {subject.yearLevel} • Semester {subject.semester}
                                        {isNewlyAdded && <span className="text-green-600 ml-2">(New)</span>}
                                        {isMarkedForRemoval && (
                                          <span className="text-red-600 ml-2">(To be removed)</span>
                                        )}
                                      </p>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        handleRemoveSubject(subject)
                                        
                                      }}
                                      disabled={isMarkedForRemoval}
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )
                              })
                            ) : (
                              <p className="text-sm text-muted-foreground">No subjects assigned to this course yet.</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      

        <DeleteModal 
          open={deleteCourseOpen}
          onOpenChange={setDeleteCourseOpen}
          id={deleteId}
          title={`Delete ${selectedCourseType?.name}`}
          routeLink={'admin.deleteCourse'}
          description={"This will permanently delete the course"}
          toastMessage={`Course "${selectedCourseType?.name}" deleted successfully`}
          buttonTitle="Confirm"
          type='delete'
          additionalInfo={[
            `Course "${selectedCourseType?.name}" will be deleted`,
            'All of the data associated with this course will also be deleted',
            "You can re-create the course if needed"
          ]}
        />

        <DeleteModal 
          open={removeSubjectOpen}
          onOpenChange={setRemoveSubjectOpen}
          id={subjectId}
          title={`Remove ${selectedSubject?.title}`}
          routeLink="admin.removeSubject"  // Pass route name instead of path
          description={"This will permanently remove the subject from this course"}
          toastMessage="Removal complete"
          buttonTitle="Confirm"
          type='remove'
          additionalInfo={[
            `Subject "${selectedSubject?.title}" will be remove from this course`,
            "You can re-add the subject to this course later if needed"
          ]}
        />

       

        <AlertDialog open={openEditModal} onOpenChange={setOpenEditModal}>
          <AlertDialogContent className="sm:max-w-[500px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Edit Course
              </AlertDialogTitle>
            </AlertDialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="edit-code">Code</Label>
                  <Input
                    id="courseCode"
                    value={editCourse?.code || ""}
                    onChange={(e) => setEditCourse({ ...editCourse!, code: e.target.value })}
                    placeholder="Enter course code"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="courseName"
                    value={editCourse?.name || ""}
                    onChange={(e) => setEditCourse({ ...editCourse!, name: e.target.value })}
                    placeholder="Enter course name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="courseDescription"
                  value={editCourse?.description || ""}
                  onChange={(e) => setEditCourse({ ...editCourse!, description: e.target.value })}
                  placeholder="Enter course description"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={editCourse?.isActive === 1 ? "active" : "inactive"}
                onValueChange={(value) => {
                  setEditCourse({
                    ...editCourse!,
                    isActive: value === "active" ? 1 : 0,
                  })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Active
                    </div>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      Inactive
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpenEditModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleSaveChanges(editCourse!.id)}>Save Changes</Button>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  )
}
