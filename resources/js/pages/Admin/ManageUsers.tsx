"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Users,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Filter,
  UserCheck,
  UserX,
  Crown,
  GraduationCap,
  BookOpen,
  UserPlus,
  Mail,
  Shield,
} from "lucide-react"

import type { UserData } from "@/types/utils/user-types"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { Head, useForm } from "@inertiajs/react"
import { EditUserModal } from "@/components/modal/user/edit-user"
import { DeleteUserModal } from "@/components/modal/user/delete-user"

// Update the component signature to accept UserProps
interface UserProps {
  users: UserData[]
}

export default function ManageUsers({ users: initialUsers }: UserProps) {
  // Change this line:
  // const [users, setUsers] = useState<UserData[]>(mockUsers)
  // To this:
  const [users, setUsers] = useState<UserData[]>(initialUsers || [])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Edit modal state
  const [editUser, setEditUser] = useState<UserData | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Delete modal state
  const [deleteUser, setDeleteUser] = useState<UserData | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // Add user form state
  // const [formData, setFormData] = useState({
  //   name: "",
  //   account_id: "",
  //   email: "",
  //   role: "",
  //   password: "",
  //   password_confirmation: "",
  // })

  // Add this after the state declarations:
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    account_id: "",
    email: "",
    role: "",
    password: "",
    password_confirmation: "",
  })

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.account_id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  // Update the handleAddUser function:
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    post(route("admin.addUser"), {
      ...data,
      onSuccess: () => {
        reset()
        // Optionally refresh the page or update local state
        window.location.reload()
      },
    })
  }

  const handleEditUser = (user: UserData) => {
    setEditUser(user)
    setIsEditModalOpen(true)
  }

  const handleSaveUser = (updatedUser: UserData) => {
    setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
  }

  const handleDeleteUser = (user: UserData) => {
    setDeleteUser(user)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId))
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4" />
      case "instructor":
        return <GraduationCap className="h-4 w-4" />
      case "student":
        return <BookOpen className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
      case "instructor":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
      case "student":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
      : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200"
  }

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Users",
      href: "admin/manageUsers",
    },
  ]

  // Wrap the return statement with AppLayout
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Users" />
      <div className="space-y-6 p-6 bg-background text-foreground">
        {/* Header Section */}
        <div className="rounded-lg p-6 border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">User Management</h1>
              <p className="text-muted-foreground mt-1">Manage users, roles, and permissions in your system</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User List
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add User
            </TabsTrigger>
          </TabsList>

          {/* User List Tab */}
          <TabsContent value="list" className="space-y-6">
            {/* Header with Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                      <p className="text-2xl font-bold">{users.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                      <p className="text-2xl font-bold text-green-600">
                        {users.filter((u) => u.status === "active").length}
                      </p>
                    </div>
                    <UserCheck className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Inactive Users</p>
                      <p className="text-2xl font-bold text-gray-600">
                        {users.filter((u) => u.status === "inactive").length}
                      </p>
                    </div>
                    <UserX className="h-8 w-8 text-gray-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Administrators</p>
                      <p className="text-2xl font-bold text-red-600">
                        {users.filter((u) => u.role === "admin").length}
                      </p>
                    </div>
                    <Crown className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  All Users ({filteredUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users by name, email, or account ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <Filter className="h-4 w-4" />
                          Role: {roleFilter === "all" ? "All" : roleFilter}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setRoleFilter("all")}>All Roles</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRoleFilter("admin")}>Admin</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRoleFilter("instructor")}>Instructor</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRoleFilter("student")}>Student</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <Filter className="h-4 w-4" />
                          Status: {statusFilter === "all" ? "All" : statusFilter}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Status</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>Inactive</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Users Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Account ID</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <div className="flex flex-col items-center gap-2">
                              <Users className="h-8 w-8 text-muted-foreground" />
                              <p className="text-muted-foreground">
                                {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                                  ? "No users match your search criteria"
                                  : "No users found"}
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>
                                    {user.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="bg-muted px-2 py-1 rounded text-sm">{user.account_id}</code>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  user.role === "admin"
                                    ? "destructive"
                                    : user.role === "instructor"
                                      ? "default"
                                      : "secondary"
                                }
                                className="gap-1"
                              >
                                {getRoleIcon(user.role)}
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(user.created_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditUser(user)} className="gap-2">
                                    <Edit className="h-4 w-4" />
                                    Edit User
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteUser(user)}
                                    className="gap-2 text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete User
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {filteredUsers.length > 0 && (
                  <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                    <p>
                      Showing {filteredUsers.length} of {users.length} users
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add User Tab */}
          <TabsContent value="add">
            <Card className="shadow-lg border-border">
              <CardHeader className="rounded-t-lg bg-card">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <UserPlus className="h-5 w-5 text-primary" />
                  Add New User
                  {data.role && (
                    <Badge className={getRoleBadgeColor(data.role)}>
                      {data.role.charAt(0).toUpperCase() + data.role.slice(1)}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-8 bg-card">
                <form onSubmit={handleAddUser} className="space-y-8">
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
                          onChange={(e) => setData({ ...data, name: e.target.value })}
                          placeholder="Enter full name"
                          className="h-11 transition-colors"
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
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                            placeholder="Enter email address"
                            className="h-11 pl-10 transition-colors"
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
                          onChange={(e) => setData({ ...data, account_id: e.target.value })}
                          placeholder="Enter account ID"
                          className="h-11 transition-colors"
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
                        <Select value={data.role} onValueChange={(value) => setData({ ...data, role: value })}>
                          <SelectTrigger className="h-11 transition-colors">
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
                          onChange={(e) => setData({ ...data, password: e.target.value })}
                          placeholder="Enter password (min. 8 characters)"
                          className="h-11 transition-colors"
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
                        <Label htmlFor="password_confirmation" className="text-sm font-medium flex items-center gap-1">
                          Confirm Password <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="password_confirmation"
                          type="password"
                          value={data.password_confirmation}
                          onChange={(e) => setData({ ...data, password_confirmation: e.target.value })}
                          placeholder="Confirm password"
                          className="h-11 transition-colors"
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
                      type="submit"
                      className="w-full h-12 text-base font-medium shadow-lg transition-all duration-200"
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
                    <h3 className="font-medium text-amber-700 dark:text-amber-300">
                      <strong>Important Notes</strong>
                    </h3>
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
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <EditUserModal
          user={editUser}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditUser(null)
          }}
          onSave={handleSaveUser}
        />

        <DeleteUserModal
          user={deleteUser}
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false)
            setDeleteUser(null)
          }}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </AppLayout>
  )
}
