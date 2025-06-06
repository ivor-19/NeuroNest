import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Award, Clock, Play, User, Settings, LogOut, Plus } from "lucide-react"
import HeaderLayout from "@/layouts/header-layout"
import { BreadcrumbItem } from "@/types"
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern"

interface User {
    id: number;
    name: string;
    email: string;
    role?: string;
}

interface TeacherDashboardProps {
    user: User;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/student/dashboard',
    },
];

export default function Dashboard({ user }: TeacherDashboardProps) {
  const studentCourses = [
    {
      id: 1,
      title: "React Fundamentals",
      teacher: "Jake the Dog",
      progress: 75,
      totalLessons: 12,
      completedLessons: 9,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      title: "JavaScript Advanced",
      teacher: "Monkey D. Luffy",
      progress: 45,
      totalLessons: 15,
      completedLessons: 7,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      title: "UI/UX Design Principles",
      teacher: "Lebron James",
      progress: 20,
      totalLessons: 10,
      completedLessons: 2,
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  const teacherCourses = [
    {
      id: 1,
      title: "React Fundamentals",
      students: 234,
      lessons: 12,
      rating: 4.8,
      status: "Published",
    },
    {
      id: 2,
      title: "Advanced JavaScript",
      students: 156,
      lessons: 15,
      rating: 4.9,
      status: "Published",
    },
    {
      id: 3,
      title: "Node.js Backend Development",
      students: 89,
      lessons: 8,
      rating: 4.7,
      status: "Draft",
    },
  ]

  return (
    <HeaderLayout breadcrumbs={breadcrumbs}>
        <div className="min-h-screen mt-20">
            {/* Header */}
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Instructor Dashboard */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
                        <p className="text-gray-600 mt-2">Manage your courses and students</p>
                    </div>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Course
                    </Button>   
                </div>

                {/* Instructor Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                        <div className="flex items-center">
                            <BookOpen className="h-8 w-8 text-blue-600" />
                            <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Courses</p>
                            <p className="text-2xl font-bold text-gray-900">3</p>
                            </div>
                        </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                        <div className="flex items-center">
                            <Users className="h-8 w-8 text-green-600" />
                            <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Students</p>
                            <p className="text-2xl font-bold text-gray-900">479</p>
                            </div>
                        </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                        <div className="flex items-center">
                            <Award className="h-8 w-8 text-purple-600" />
                            <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                            <p className="text-2xl font-bold text-gray-900">4.8</p>
                            </div>
                        </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                        <div className="flex items-center">
                            <Clock className="h-8 w-8 text-orange-600" />
                            <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">$12,450</p>
                            </div>
                        </div>
                        </CardContent>
                    </Card>
                </div>

                {/* My Courses */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">My Courses</h2>
                    <div className="space-y-4">
                        {teacherCourses.map((course) => (
                        <Card key={course.id}>
                            <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                    <span>{course.students} students</span>
                                    <span>{course.lessons} lessons</span>
                                    <span>★ {course.rating}</span>
                                </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                <Badge variant={course.status === "Published" ? "default" : "secondary"}>
                                    {course.status}
                                </Badge>
                                <Button variant="outline" size="sm">
                                    Edit Course
                                </Button>
                                </div>
                            </div>
                            </CardContent>
                        </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </HeaderLayout>
  )
}
