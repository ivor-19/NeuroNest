import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, BookOpen, Users, GraduationCap, Settings, FileText, Users2, User, LibraryBig, TrendingUp, Calendar, Edit3, Trash2, PlusCircle, NotepadTextDashed } from "lucide-react"
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect } from 'react';

type DashboardProps = {
  authUser: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  users: {
    id: number;
    name: string;
    email: string;
    role: string;
  }[];
  roleCounts: {
    student: number;
    instructor: number;
    admin: number;
  }
  subjectsCount: number;
  coursesCount: number;
  activities: {
    id: number,
    user: string,
    type: string,
    action: string,
    details: string,
    created_at: string,
  }[]
}

const recentActivity = [
  { id: 1, user: "John Doe", action: "Added a new student", details: "Emma Thompson to Grade 10A", time: "2 minutes ago", type: "create", icon: UserPlus },
  { id: 2, user: "Jane Smith", action: "Created new course", details: "Advanced Mathematics", time: "5 minutes ago", type: "create", icon: BookOpen },
  { id: 3, user: "Mike Johnson", action: "Updated subject", details: "Physics curriculum modified", time: "10 minutes ago", type: "edit", icon: Edit3 },
  { id: 4, user: "Sarah Wilson", action: "Set schedule", details: "Monday 9:00 AM - Chemistry Lab", time: "15 minutes ago", type: "schedule", icon: Calendar },
  { id: 5, user: "Tom Brown", action: "Deleted assignment", details: "Homework #3 - Biology", time: "20 minutes ago", type: "delete", icon: Trash2 },
  { id: 6, user: "Lisa Davis", action: "Added subject", details: "Computer Science to curriculum", time: "25 minutes ago", type: "create", icon: GraduationCap }
];


const getActionColor = (type: string) => {
  switch (type) {
    case "create":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "edit":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "delete":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    case "schedule":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

const quickActions = [
  { title: 'Add New User', description: 'Registrer a new user account', icon: UserPlus, action: "add", priority: "high"},
  { title: 'Manage Course', description: 'Create and manage courses offered in the curriculum', icon: UserPlus, action: "add", priority: "medium"},
  { title: 'Manage Subject', description: 'Create and manage subjects and their associated modules', icon: BookOpen, action: "add", priority: "medium"},
  { title: 'Assign to Section', description: 'Assign students to their respective class sections', icon: User, action: "add", priority: "low"},
  { title: 'Link Subject to Course', description: 'Map subjects to degree programs', icon: Settings, action: "add", priority: "low"},
  { title: 'Generate Reports', description: 'Progress reports', icon: FileText, action: "add-student", priority: "low"},
]

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: 'admin/dashboard',
    },
];


export default function Dashboard({ authUser, users, roleCounts, subjectsCount, coursesCount, activities} : DashboardProps) {
 
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
          <Head title="Dashboard" />
          <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-8 overflow-x-auto ">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
                  <Users2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{roleCounts.student}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">1</span> from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Subjects</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{subjectsCount}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">1</span> from last month
                  </p>
                </CardContent>
              </Card> <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Instructors</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{roleCounts.instructor}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">1</span> from last month
                  </p>
                </CardContent>
              </Card> <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Courses</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{coursesCount}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">1</span> from last month
                  </p>
                </CardContent>
              </Card>
            </div>
      
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest user actions on your platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity) => {
                      return (
                        <div
                          key={activity.id}
                          className="flex items-start gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                        >
                          <div className={`p-2 rounded-full ${getActionColor(activity.type)}`}>
                            {activity.type === 'create' ? (
                              <PlusCircle className='h-4 w-4'/>
                            ): activity.type === 'edit' ? (
                              <Edit3 className='h-4 w-4'/>
                            ): activity.type === 'delete' ? (
                              <Trash2 className='h-4 w-4'/>
                            ): activity.type === 'schedule' ? (
                              <Calendar className='h-4 w-4'/>
                            ) : (
                              <NotepadTextDashed className='h-4 w-4'/>
                            )}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium leading-none">{activity.user}</p>
                              <Badge variant="outline" className="text-xs">
                                {activity.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-foreground">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">{activity.details}</p>
                          </div>
                          <div className="text-xs text-muted-foreground whitespace-nowrap">{activity.created_at}</div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      View all activity →
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-3">
                    {quickActions.map((action) => (
                      <Button key={action.action} variant="outline" className="justify-start h-auto p-4 cursor-pointer">
                       <div className="flex items-center gap-3 w-full">
                          <div
                            className={`p-2 rounded-lg ${
                              action.priority === "high"
                                ? "bg-red-100 text-red-600"
                                : action.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "bg-green-100 text-green-600"
                            }`}
                          >
                          <action.icon className="h-4 w-4" />
                         </div>
                         <div className="text-left w-full break-words">
                          <p className="font-medium text-sm break-words">{action.title}</p>
                          <p className="text-xs text-muted-foreground break-words">{action.description}</p>
                        </div>
                       </div>
                     </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
      </AppLayout>
    );
}
