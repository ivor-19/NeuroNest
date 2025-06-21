import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Lock, Mail, Shield, User, UserPlus } from "lucide-react"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: 'admin/manageUsers',
    },
];

export default function ManageUsers() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    account_id: "",
    email: "",
    role: "",
    password: "",
    password_confirmation: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route('admin.addUser'), {
      onSuccess: () => {
        reset()
      }
    })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Users" />
      <div className="space-y-6 p-6 bg-background text-foreground">
        {/* Header Section */}
        <div className="rounded-lg p-6 border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">User Management</h1>
              <p className="text-muted-foreground mt-1">Add new users to your system with appropriate roles and permissions</p>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <Card className="shadow-lg border-border">
          <CardHeader className="rounded-t-lg bg-card">
            <CardTitle className="flex items-center gap-3 text-xl">
              <UserPlus className="h-5 w-5 text-primary" />
              Add New User
              {data.role && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    data.role === "admin"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                      : data.role === "instructor"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                  }`}
                >
                  {data.role.charAt(0).toUpperCase() + data.role.slice(1)}
                </span>
              )}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8 bg-card">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-4">
               

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium flex items-center gap-1">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={(e) => setData("name", e.target.value)}
                      placeholder="Enter full name"
                      className={`h-11 transition-colors ${errors.name ? "border-destructive focus:border-destructive" : "border-input focus:border-primary"}`}
                      required
                    />
                    {errors.name && (
                      <div className="flex items-center gap-1 text-destructive text-sm">
                        <span className="w-1 h-1 bg-destructive rounded-full"></span>
                        {errors.name}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1">
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="Enter email address"
                        className={`h-11 pl-10 transition-colors ${errors.email ? "border-destructive focus:border-destructive" : "border-input focus:border-primary"}`}
                        required
                      />
                    </div>
                    {errors.email && (
                      <div className="flex items-center gap-1 text-destructive text-sm">
                        <span className="w-1 h-1 bg-destructive rounded-full"></span>
                        {errors.email}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Information Section */}
              <div className="space-y-4">
              
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="account_id" className="text-sm font-medium flex items-center gap-1">
                      Account ID <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="account_id"
                      value={data.account_id}
                      onChange={(e) => setData("account_id", e.target.value)}
                      placeholder="Enter account ID"
                      className={`h-11 transition-colors ${errors.account_id ? "border-destructive focus:border-destructive" : "border-input focus:border-primary"}`}
                      required
                    />
                    {errors.account_id && (
                      <div className="flex items-center gap-1 text-destructive text-sm">
                        <span className="w-1 h-1 bg-destructive rounded-full"></span>
                        {errors.account_id}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium flex items-center gap-1">
                      User Role <span className="text-destructive">*</span>
                    </Label>
                    <Select value={data.role} onValueChange={(value) => setData("role", value)}>
                      <SelectTrigger
                        className={`h-11 transition-colors ${errors.role ? "border-destructive" : "border-input"}`}
                      >
                        <SelectValue placeholder="Select user role" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover text-popover-foreground">
                        <SelectItem value="student">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Student
                          </div>
                        </SelectItem>
                        <SelectItem value="instructor">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Teacher/Instructor
                          </div>
                        </SelectItem>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            Administrator
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.role && (
                      <div className="flex items-center gap-1 text-destructive text-sm">
                        <span className="w-1 h-1 bg-destructive rounded-full"></span>
                        {errors.role}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div className="space-y-4">
               

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium flex items-center gap-1">
                      Password <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={data.password}
                      onChange={(e) => setData("password", e.target.value)}
                      placeholder="Enter password (min. 8 characters)"
                      className={`h-11 transition-colors ${errors.password ? "border-destructive focus:border-destructive" : "border-input focus:border-primary"}`}
                      required
                    />
                    {errors.password && (
                      <div className="flex items-center gap-1 text-destructive text-sm">
                        <span className="w-1 h-1 bg-destructive rounded-full"></span>
                        {errors.password}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password_confirmation"
                      className="text-sm font-medium flex items-center gap-1"
                    >
                      Confirm Password <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="password_confirmation"
                      type="password"
                      value={data.password_confirmation}
                      onChange={(e) => setData("password_confirmation", e.target.value)}
                      placeholder="Confirm password"
                      className={`h-11 transition-colors ${errors.password_confirmation ? "border-destructive focus:border-destructive" : "border-input focus:border-primary"}`}
                      required
                    />
                    {errors.password_confirmation && (
                      <div className="flex items-center gap-1 text-destructive text-sm">
                        <span className="w-1 h-1 bg-destructive rounded-full"></span>
                        {errors.password_confirmation}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-border">
                <Button
                  variant={"default"}
                  className="w-full h-12 text-base font-medium shadow-lg transition-all duration-200 cursor-pointer"
                  disabled={processing}
                >
                  {processing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adding User...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-5 w-5" />
                      Add User
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-amber-50 border-amber-300 border dark:bg-amber-900/20 dark:border-amber-700/80 text-amber-700 dark:text-amber-300">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-primary/10 rounded-full mt-1">
                <Shield className="h-4 w-4 text-amber-700 dark:text-amber-300" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-amber-700 dark:text-amber-300"><strong>Important Notes</strong></h3>
                <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                  <li>• All fields marked with * are required</li>
                  <li>• Passwords must be at least 8 characters long</li>
                  <li>• Account IDs should be unique across the system</li>
                  <li>• Users will receive an email notification upon account creation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}