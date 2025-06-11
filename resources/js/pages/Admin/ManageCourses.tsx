import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Search, Minus, Save, X } from "lucide-react"

type CourseProps = {
  courses: {
    id: number,
    name: string,
    code: string,
    description: string,
    isActive: number,
    subjects?: {
      id: number,
      code: string,
      title: string,
      yearLevel: number,
      semester: number,
    }[]
  }[],
  allSubjects: {
    id: number,
    code: string,
    title: string,
    yearLevel: number,
    semester: number,
  }[]
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Courses',
        href: 'admin/manageCourses',
    },
];

export default function ManageCourses({ courses, allSubjects } : CourseProps) {
  const [activeTab, setActiveTab] = useState("view-courses")
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null)
  const [newCourse, setNewCourse] = React.useState<CourseProps | null>(null)
  
  // State for managing curriculum changes
  const [curriculumChanges, setCurriculumChanges] = useState<{
    toAdd: number[],
    toRemove: number[]
  }>({ toAdd: [], toRemove: [] })
  const [hasChanges, setHasChanges] = useState(false)

  const { data, setData, post, processing, errors, reset} = useForm({
    code: '',
    name: '',
    description: '',
  })

  // Form for curriculum changes
  const curriculumForm = useForm({
    course_id: 0,
    toAdd: [] as number[],
  })

  // Get current subjects for the selected course
  const getCurrentCourseSubjects = () => {
    if (!selectedCourse) return [];
    
    const course = courses.find(c => c.id === selectedCourse);
    const originalSubjects = course?.subjects || [];
    
    // Apply pending changes
    let modifiedSubjects = [...originalSubjects];
    
    // Remove subjects that are marked for removal
    modifiedSubjects = modifiedSubjects.filter(subject => 
      !curriculumChanges.toRemove.includes(subject.id)
    );
    
    // Add subjects that are marked for addition
    const subjectsToAdd = allSubjects.filter(subject => 
      curriculumChanges.toAdd.includes(subject.id)
    );
    modifiedSubjects = [...modifiedSubjects, ...subjectsToAdd];
    
    return modifiedSubjects;
  };

  // Get available subjects for the selected course (subjects not in this course)
  const getAvailableSubjects = () => {
    if (!selectedCourse) return [];
    
    const course = courses.find(c => c.id === selectedCourse);
    if (!course) return allSubjects;
    
    const originalSubjectIds = course.subjects?.map(s => s.id) || [];
    
    // Filter out subjects that are already in course or marked for addition
    return allSubjects.filter(subject => 
      !originalSubjectIds.includes(subject.id) && 
      !curriculumChanges.toAdd.includes(subject.id) &&
      !curriculumChanges.toRemove.includes(subject.id)
    );
  };

  // Add subject to curriculum (move from available to current)
  const addSubjectToCurriculum = (subjectId: number) => {
    setCurriculumChanges(prev => ({
      ...prev,
      toAdd: [...prev.toAdd, subjectId]
    }));
    setHasChanges(true);
  };

  // Remove subject from curriculum (move from current to available)
  const removeSubjectFromCurriculum = (subjectId: number) => {
    const course = courses.find(c => c.id === selectedCourse);
    const isOriginalSubject = course?.subjects?.some(s => s.id === subjectId);
    
    if (isOriginalSubject) {
      // If it's an original subject, mark for removal
      setCurriculumChanges(prev => ({
        ...prev,
        toRemove: [...prev.toRemove, subjectId]
      }));
    } else {
      // If it's a newly added subject, remove from toAdd list
      setCurriculumChanges(prev => ({
        ...prev,
        toAdd: prev.toAdd.filter(id => id !== subjectId)
      }));
    }
    setHasChanges(true);
  };

  // Save curriculum changes (only additions for now)
  const saveCurriculumChanges = () => {
    if (!selectedCourse || curriculumChanges.toAdd.length === 0) {
      console.log('No course selected or no subjects to add');
      return;
    }

    const payload = {
      course_id: selectedCourse,
      toAdd: curriculumChanges.toAdd,
    };

    console.log('Saving changes:', payload);

    // Using router.post instead of form
    router.post(route('admin.assignSubjects'), payload, {
      onSuccess: () => {
        // Reset changes state
        setCurriculumChanges({ toAdd: [], toRemove: [] });
        setHasChanges(false);
        
        console.log('Subjects added successfully!');
      },
      onError: (errors) => {
        console.error('Error saving curriculum changes:', errors);
        console.log('Current selectedCourse:', selectedCourse);
        console.log('Current toAdd:', curriculumChanges.toAdd);
        console.log('Available courses:', courses.map(c => ({ id: c.id, name: c.name })));
      }
    });
  };

  // Cancel curriculum changes
  const cancelCurriculumChanges = () => {
    setCurriculumChanges({ toAdd: [], toRemove: [] });
    setHasChanges(false);
  };

  // Reset changes when course selection changes
  const handleCourseChange = (courseId: string) => {
    if (hasChanges) {
      if (confirm('You have unsaved changes. Do you want to discard them?')) {
        setCurriculumChanges({ toAdd: [], toRemove: [] });
        setHasChanges(false);
        setSelectedCourse(Number.parseInt(courseId));
      }
    } else {
      setSelectedCourse(Number.parseInt(courseId));
    }
  };
 
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault()

    post(route('admin.addCourse'), {
      onSuccess: () => {
        reset();
        
      }
    })
   
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Manage Students" />
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl overflow-x-auto p-8 bg-[var(--bg-main)]">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Courses & Curriculum</h1>
            <p className="text-muted-foreground">
              Manage degree programs and their curriculum. Create courses first, then add subjects to build the curriculum.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-[var(--bg-main-2)]">
              <TabsTrigger value="view-courses">View Courses</TabsTrigger>
              <TabsTrigger value="add-course">Add New Course</TabsTrigger>
              <TabsTrigger value="manage-curriculum">Manage Curriculum</TabsTrigger>
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
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div key={course.id} className="border rounded-lg p-4">
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
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="border-t pt-3">
                          <h4 className="font-medium mb-2">Curriculum ({course.subjects?.length || 0} subjects)</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {course.subjects?.slice(0, 4).map((subject) => (
                              <div key={subject.code} className="flex items-center justify-between p-2 bg-secondary rounded">
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
                                setSelectedCourse(course.id);
                                setActiveTab("manage-curriculum");
                              }}
                            >
                              View all {course.subjects?.length} subjects →
                            </Button>
                          )}
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
                          onChange={e => setData('code', e.target.value)}
                          placeholder="e.g. BSIS, BSCS"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">Course Name</Label>
                        <Input
                          id="name"
                          value={data.name}
                          onChange={e => setData('name', e.target.value)}
                          placeholder="e.g. Bachelor of Science in Information Systems"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={data.description}
                        onChange={e => setData('description', e.target.value)}
                        placeholder="Enter course description"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleAddCourse}>Add Course</Button>
                      <Button variant="outline" onClick={() => setActiveTab("view-courses")}>
                        Cancel
                      </Button>
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
                          {processing ? 'Saving...' : 'Save Changes'}
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
                    <Select
                      value={selectedCourse?.toString() || ""}
                      onValueChange={handleCourseChange}
                    >
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
                    <div className="mb-4 p-3 bg-green-100 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        You have unsaved changes. 
                        {curriculumChanges.toAdd.length > 0 && ` ${curriculumChanges.toAdd.length} subject(s) to add.`}
                        {curriculumChanges.toRemove.length > 0 && ` ${curriculumChanges.toRemove.length} subject(s) to remove.`}
                      </p>
                    </div>
                  )}

                  {selectedCourse && (
                    <div className="grid gap-6 lg:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Available Subjects</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Subjects not assigned to this course
                          </p>
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
                          <p className="text-sm text-muted-foreground">
                            Subjects assigned to this course
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {getCurrentCourseSubjects().length > 0 ? (
                              getCurrentCourseSubjects().map((subject) => {
                                const isNewlyAdded = curriculumChanges.toAdd.includes(subject.id);
                                const isMarkedForRemoval = curriculumChanges.toRemove.includes(subject.id);
                                
                                return (
                                  <div 
                                    key={subject.id} 
                                    className={`flex items-center justify-between p-3 border rounded ${
                                      isNewlyAdded ? 'border-green-200 bg-green-100' : 
                                      isMarkedForRemoval ? 'border-red-300 bg-red-50 opacity-50' : ''
                                    }`}
                                  >
                                    <div>
                                      <p className="font-medium text-sm text-zinc-900">{subject.title}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {subject.code} • Year {subject.yearLevel} • Semester {subject.semester}
                                        {isNewlyAdded && <span className="text-green-600 ml-2">(New)</span>}
                                        {isMarkedForRemoval && <span className="text-red-600 ml-2">(To be removed)</span>}
                                      </p>
                                    </div>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => removeSubjectFromCurriculum(subject.id)}
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                );
                              })
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                No subjects assigned to this course yet.
                              </p>
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
    </div>
   </AppLayout>
  )
}