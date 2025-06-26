"use client"

import { useForm } from "@inertiajs/react"
import { GalleryVerticalEnd, LoaderCircle } from "lucide-react"
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
      
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/assets/sample_bg.jpg"
          alt="Login background"
          className="absolute inset-0 h-full w-full object-cover "
        //   className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-background/0" />
      </div>

      <div className="flex flex-col">
      

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-sm space-y-6">
          {/* Title Section */}
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
          </div>

          {/* Status Message */}
          {status && (
            <Alert>
              <AlertDescription>{status}</AlertDescription>
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-4">
              {/* Account ID Field */}
              <div className="space-y-2">
                <Label htmlFor="account_id">Account ID</Label>
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
                  className="w-full"
                />
                <InputError message={errors.account_id} />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {canResetPassword && (
                    <TextLink href={route("password.request")} className="text-sm" tabIndex={5}>
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
                  className="w-full"
                />
                <InputError message={errors.password} />
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  name="remember"
                  checked={data.remember}
                  onCheckedChange={(checked) => setData("remember", !!checked)}
                  tabIndex={3}
                />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                  Remember me 
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" tabIndex={4} disabled={processing}>
              {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
              {processing ? "Signing in..." : "Sign in"}
            </Button>
          </form>

         
        </div>
      </div>
    </div>
    </div>
  )
}
