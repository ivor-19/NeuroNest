"use client"

import { Head, useForm } from "@inertiajs/react"
import { GraduationCap, LoaderCircle, BookOpen, Users, Award, Home } from "lucide-react"
import type { FormEventHandler } from "react"
import InputError from "@/components/built-in-shadcn/input-error"
import TextLink from "@/components/built-in-shadcn/text-link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

type LoginForm = {
  account_id: string
  password: string
  remember: boolean
}

interface LoginProps {
  status?: string
  canResetPassword: boolean
}

export default function Login({ status, canResetPassword }: LoginProps) {
  const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
    account_id: "",
    password: "",
    remember: false,
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post(route("login"), {
      onFinish: () => reset("password"),
    })
  }

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <Head title={"Login"} />

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 backdrop-blur-sm border border-white/20 cursor-pointer"
          onClick={() => window.history.back()}
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>
      </div>

      {/* Left Side - Hero Section */}
      <div className="relative hidden bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 lg:flex lg:flex-col lg:justify-center lg:items-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-24 h-24 bg-white rounded-full opacity-15 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full opacity-25 animate-pulse delay-500"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-8 max-w-md">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl font-bold mb-4">Welcome to NeuroNest</h1>
          <p className="text-xl text-teal-100 mb-8 leading-relaxed">
            Your digital nest for lifelong learning and educational excellence
          </p>

          {/* Feature Highlights */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-teal-100">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-sm">Interactive Learning Experience</span>
            </div>
            <div className="flex items-center space-x-3 text-teal-100">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-sm">Collaborative Learning Community</span>
            </div>
            <div className="flex items-center space-x-3 text-teal-100">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <span className="text-sm">Excellence in Education</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-col bg-slate-50">
        {/* Header for mobile */}
        <div className="lg:hidden bg-gradient-to-r from-teal-600 to-teal-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 backdrop-blur-sm border border-white/20"
              onClick={() => window.history.back()}
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Neuronest</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 items-center justify-center p-6 lg:p-10">
          <div className="w-full max-w-md space-y-8">
            {/* Title Section */}
            <div className="space-y-3 text-center">
              <div className="hidden lg:flex w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h2>
              <p className="text-slate-600">Enter your credentials to access your learning dashboard</p>
            </div>

            {/* Status Message */}
            {status && (
              <Alert className="border-teal-200 bg-teal-50">
                <AlertDescription className="text-teal-800">{status}</AlertDescription>
              </Alert>
            )}

            {/* Login Form */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
              <form onSubmit={submit} className="space-y-6">
                <div className="space-y-5">
                  {/* Account ID Field */}
                  <div className="space-y-2">
                    <Label htmlFor="account_id" className="text-sm font-semibold text-slate-700">
                      Account ID
                    </Label>
                    <Input
                      id="account_id"
                      name="account_id"
                      type="text"
                      required
                      autoFocus
                      tabIndex={1}
                      autoComplete="username"
                      value={data.account_id}
                      onChange={(e) => setData("account_id", e.target.value)}
                      placeholder="MA#########"
                      className="h-12 border-slate-300 focus:border-teal-500 focus:ring-teal-500 text-slate-700"
                    />
                    <InputError message={errors.account_id} />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                        Password
                      </Label>
                      {canResetPassword && (
                        <TextLink
                          href={route("password.request")}
                          className="text-sm text-teal-600 hover:text-teal-700 font-medium text-slate-700"
                          tabIndex={5}
                        >
                          Forgot password?
                        </TextLink>
                      )}
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      tabIndex={2}
                      autoComplete="current-password"
                      value={data.password}
                      onChange={(e) => setData("password", e.target.value)}
                      placeholder="Enter your password"
                      className="h-12 border-slate-300 focus:border-teal-500 focus:ring-teal-500 text-slate-700"
                    />
                    <InputError message={errors.password} />
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="remember"
                      name="remember"
                      checked={data.remember}
                      onCheckedChange={(checked) => setData("remember", !!checked)}
                      tabIndex={3}
                      className="border-slate-300 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600 text-slate-700"
                    />
                    <Label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">
                      Keep me signed in
                    </Label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  tabIndex={4}
                  disabled={processing}
                >
                  {processing && <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />}
                  {processing ? "Signing in..." : "Sign in to your account"}
                </Button>
              </form>

             
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-slate-500">
              <p>© 2025 NeuroNest. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
