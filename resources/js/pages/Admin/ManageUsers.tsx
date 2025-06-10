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
import { UserPlus } from "lucide-react"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: 'admin/manageUsers',
    },
];

export default function ManageUsers() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
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
        // Optionally add a success message here
      }
    })
  }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Add New User
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Enter full name"
                        required
                      />
                      {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Enter email address"
                        required
                      />
                      {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">User Role</Label>
                    <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="teacher">Teacher/Instructor</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.role && <span className="text-red-500 text-sm">{errors.role}</span>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Enter password"
                        required
                      />
                      {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password_confirmation">Confirm Password</Label>
                      <Input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        placeholder="Confirm password"
                        required
                      />
                      {errors.password_confirmation && <span className="text-red-500 text-sm">{errors.password_confirmation}</span>}
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={processing}>
                    {processing ? 'Adding User...' : 'Add User'}
                  </Button>
                </form>
              </CardContent>
            </Card>
        </AppLayout>
    );
}