import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Play, Clock, Star, CheckCircle, Lock, ArrowLeft, FileText, Video, Award } from "lucide-react"
import HeaderLayout from "@/layouts/header-layout"
import { Head } from "@inertiajs/react"

export default function Modules() {
  const [enrolledCourse, setEnrolledCourse] = useState(true) // Set to true to show modules

  // Mock course data - in real app, this would be fetched based on params.id
  const course = {
    id: 1,
    title: "React Fundamentals",
    instructor: "Sarah Johnson",
    category: "Web Development",
    price: 89.99,
    rating: 4.8,
    students: 12543,
    duration: "40 hours",
    level: "Beginner",
    description: "Master React from the ground up with hands-on projects and real-world examples.",
    modules: [
      {
        id: 1,
        title: "Getting Started with React",
        description:
          "Introduction to React, setting up your development environment, and creating your first component.",
        duration: "45 min",
        lessons: 5,
        completed: true,
        type: "video",
        difficulty: "Beginner",
      },
      {
        id: 2,
        title: "Components and JSX",
        description: "Learn how to create reusable components and understand JSX syntax.",
        duration: "60 min",
        lessons: 7,
        completed: true,
        type: "video",
        difficulty: "Beginner",
      },
      {
        id: 3,
        title: "Props and State Management",
        description: "Understanding how to pass data between components and manage component state.",
        duration: "75 min",
        lessons: 8,
        completed: false,
        type: "video",
        difficulty: "Intermediate",
      },
      {
        id: 4,
        title: "Event Handling in React",
        description: "Learn how to handle user interactions and events in React applications.",
        duration: "50 min",
        lessons: 6,
        completed: false,
        type: "video",
        difficulty: "Beginner",
      },
      {
        id: 5,
        title: "React Hooks Deep Dive",
        description: "Master useState, useEffect, and other essential React hooks.",
        duration: "90 min",
        lessons: 10,
        completed: false,
        type: "video",
        difficulty: "Intermediate",
      },
      {
        id: 6,
        title: "Building Forms in React",
        description: "Create dynamic forms with validation and controlled components.",
        duration: "65 min",
        lessons: 7,
        completed: false,
        type: "video",
        difficulty: "Intermediate",
      },
      {
        id: 7,
        title: "React Router Navigation",
        description: "Implement client-side routing and navigation in your React applications.",
        duration: "55 min",
        lessons: 6,
        completed: false,
        type: "video",
        difficulty: "Intermediate",
      },
      {
        id: 8,
        title: "State Management with Context",
        description: "Learn React Context API for managing global application state.",
        duration: "70 min",
        lessons: 8,
        completed: false,
        type: "video",
        difficulty: "Advanced",
      },
      {
        id: 9,
        title: "Testing React Components",
        description: "Write unit tests for your React components using Jest and React Testing Library.",
        duration: "80 min",
        lessons: 9,
        completed: false,
        type: "video",
        difficulty: "Advanced",
      },
      {
        id: 10,
        title: "Final Project: Todo App",
        description: "Build a complete todo application using all the concepts you've learned.",
        duration: "120 min",
        lessons: 12,
        completed: false,
        type: "project",
        difficulty: "Advanced",
      },
    ],
  }

  const completedModules = course.modules.filter((module) => module.completed).length
  const progress = (completedModules / course.modules.length) * 100

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 border-green-200"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Advanced":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <HeaderLayout>
      <Head title={'Module ()'} />
      <div className="min-h-screen mt-20">
        {/* Header */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Course Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{course.category}</Badge>
              <Badge variant="outline">{course.level}</Badge>
            </div>
            <h1 className="text-4xl font-bold  mb-4">{course.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{course.description}</p>

            <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span>
                  {course.rating} ({course.students.toLocaleString()} students)
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{course.duration}</span>
              </div>
              <span>Created by {course.instructor}</span>
            </div>

            {/* Progress Overview */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Your Progress</h3>
                    <p className="text-sm text-gray-600">
                      {completedModules} of {course.modules.length} modules completed
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">{Math.round(progress)}%</div>
                  </div>
                </div>
                <Progress value={progress} className="h-3" />
              </CardContent>
            </Card>
          </div>

          {/* Course Modules List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold ">Course Modules</h2>
              <div className="text-sm text-gray-600">
                {course.modules.length} modules • {course.duration} total
              </div>
            </div>

            {course.modules.map((module, index) => (
              <Card
                key={module.id}
                className={`group transition-all duration-300 hover:shadow-lg hover:scale-[1.01] cursor-pointer overflow-hidden ${
                  module.completed
                    ? "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50"
                    : enrolledCourse
                      ? "border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 hover:border-blue-300"
                      : "border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50"
                }`}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

                <CardContent className="p-6 relative">
                  <div className="flex items-start space-x-4">
                    {/* Module Number/Status */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                          module.completed
                            ? "bg-green-500 text-white"
                            : enrolledCourse
                              ? "bg-blue-500 text-white group-hover:bg-blue-600"
                              : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {module.completed ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : enrolledCourse ? (
                          <span>{index + 1}</span>
                        ) : (
                          <Lock className="h-6 w-6" />
                        )}
                      </div>
                    </div>

                    {/* Module Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3
                            className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
                              module.completed
                                ? "text-green-800 group-hover:text-green-900"
                                : enrolledCourse
                                  ? "text-blue-800 group-hover:text-blue-900"
                                  : "text-gray-600"
                            }`}
                          >
                            {module.title}
                          </h3>
                          <p className="text-gray-600 mb-3 leading-relaxed">{module.description}</p>
                        </div>
                      </div>

                      {/* Module Meta Info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            {module.type === "video" ? (
                              <Video className="h-4 w-4 mr-1" />
                            ) : (
                              <FileText className="h-4 w-4 mr-1" />
                            )}
                            <span>{module.lessons} lessons</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{module.duration}</span>
                          </div>
                          <Badge variant="outline" className={`text-xs ${getDifficultyColor(module.difficulty)}`}>
                            {module.difficulty}
                          </Badge>
                          {module.completed && (
                            <Badge variant="default" className="text-xs bg-green-500">
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Course Completion Card */}
          {enrolledCourse && (
            <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <div className="max-w-md mx-auto">
                  <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">
                    Complete this course to earn your certificate
                  </h3>
                  <p className="text-blue-700 mb-4">Finish all modules to receive your React Fundamentals certificate</p>
                  <Progress value={progress} className="mb-4" />
                  <p className="text-sm text-blue-600">
                    {completedModules}/{course.modules.length} modules completed
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enrollment Card for Non-enrolled Users */}
          {!enrolledCourse && (
            <Card className="mt-8 bg-white border-2 border-blue-200">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to start learning?</h3>
                <p className="text-gray-600 mb-6">
                  Enroll now to access all {course.modules.length} modules and start your React journey
                </p>
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <span className="text-3xl font-bold text-blue-600">${course.price}</span>
                  <Button size="lg" onClick={() => setEnrolledCourse(true)}>
                    Enroll Now
                  </Button>
                </div>
                <p className="text-sm text-gray-500">30-day money-back guarantee</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </HeaderLayout>
  )
}
