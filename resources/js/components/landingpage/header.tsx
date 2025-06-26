"use client"

import type React from "react"

import { useState } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import { Link, usePage } from "@inertiajs/react"
import { SharedData } from "@/types"


export default function Header() {

  const { auth } = usePage<SharedData>().props;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentUrl = usePage().url;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleScrollOrNavigate = (e: React.MouseEvent<Element>, href: string, sectionId?: string) => {
    if (sectionId && currentUrl === href) {
      e.preventDefault()
      const section = document.getElementById(sectionId)
      if (section) {
        section.scrollIntoView({ behavior: "smooth" })
        return
      }
    }
    toggleMenu()
  }

  return (
    <header className="w-full relative overflow-hidden border-b border-gray-200">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FFF5F0] via-[#FFF5F0] to-[#FFF5F0]"></div>
      <div className="hidden lg:block absolute top-0 right-0 w-[35%] h-full bg-[#006A62] shadow-2xl"></div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-16">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <img
                    src="/placeholder.svg?height=80&width=80"
                    alt="NeuroNest Logo"
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#F88F60] rounded-full opacity-80"></div>
              </div>
              <div className="ml-4 hidden sm:block">
                <h1 className="text-2xl font-bold text-[#006A62] tracking-tight">NeuroNest</h1>
                <p className="text-xs text-[#006A62]/70 font-medium">Learning Platform</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              <Link
                href="/"
                className="relative px-4 py-2 text-[#006A62] hover:text-[#004A44] font-semibold transition-all duration-200 rounded-lg hover:bg-white/50 group"
                onClick={(e) => handleScrollOrNavigate(e, "/")}
              >
                Home
                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#F88F60] transition-all duration-200 group-hover:w-8 group-hover:left-1/2 group-hover:-translate-x-1/2"></div>
              </Link>
              <Link
                href="/aboutus"
                className="relative px-4 py-2 text-[#006A62] hover:text-[#004A44] font-semibold transition-all duration-200 rounded-lg hover:bg-white/50 group"
                onClick={(e) => handleScrollOrNavigate(e, "/", "about-us")}
              >
                About Us
                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#F88F60] transition-all duration-200 group-hover:w-8 group-hover:left-1/2 group-hover:-translate-x-1/2"></div>
              </Link>
              <Link
                href="/contactus"
                className="relative px-4 py-2 text-[#006A62] hover:text-[#004A44] font-semibold transition-all duration-200 rounded-lg hover:bg-white/50 group"
                onClick={(e) => handleScrollOrNavigate(e, "/contactus")}
              >
                Contact Us
                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#F88F60] transition-all duration-200 group-hover:w-8 group-hover:left-1/2 group-hover:-translate-x-1/2"></div>
              </Link>
            </nav>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {auth.user?.role === "admin" ? (
              <Link
                href={route('admin.dashboard')}
                className="group relative overflow-hidden rounded-xl border-2 border-white/30 px-6 py-2.5 text-sm font-semibold text-white hover:border-white/50 transition-all duration-300 hover:scale-105"
                onClick={toggleMenu}
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative">Dashboard</span>
              </Link>
            ) : auth.user?.role === "instructor" ? (
              <Link
                href={route('instructor.dashboard')}
                className="group relative overflow-hidden rounded-xl border-2 border-white/30 px-6 py-2.5 text-sm font-semibold text-white hover:border-white/50 transition-all duration-300 hover:scale-105"
                onClick={toggleMenu}
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative">Instructor Panel</span>
              </Link>
            ) : auth.user?.role === "student" ? (
              <Link
                href={route('student.dashboard')}
                className="group relative overflow-hidden rounded-xl border-2 border-white/30 px-6 py-2.5 text-sm font-semibold text-white hover:border-white/50 transition-all duration-300 hover:scale-105"
                onClick={toggleMenu}
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative">Student Portal</span>
              </Link>
            ) : (
              <div className="flex items-center space-x-3">
             
                <Link
                  href={route('login')}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#F88F60] to-[#e77d4d] px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={toggleMenu}
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                  <span className="relative">Login</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              type="button"
              className="relative p-2 text-[#006A62] hover:text-[#004A44] hover:bg-white/50 rounded-lg transition-all duration-200"
              onClick={toggleMenu}
            >
              <div className="w-6 h-6 relative">
                <Menu
                  className={`absolute inset-0 transition-all duration-300 ${isMenuOpen ? "rotate-180 opacity-0" : "rotate-0 opacity-100"}`}
                />
                <X
                  className={`absolute inset-0 transition-all duration-300 ${isMenuOpen ? "rotate-0 opacity-100" : "-rotate-180 opacity-0"}`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <nav className="bg-white/90 backdrop-blur-sm rounded-2xl mx-4 mb-4 shadow-xl border border-white/20">
            <div className="p-6 space-y-4">
              <Link
                href="/"
                className="flex items-center justify-between p-3 text-[#006A62] hover:text-[#004A44] font-semibold transition-all duration-200 rounded-xl hover:bg-[#006A62]/5"
                onClick={(e) => handleScrollOrNavigate(e, "/")}
              >
                Home
                <ChevronDown className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/aboutus"
                className="flex items-center justify-between p-3 text-[#006A62] hover:text-[#004A44] font-semibold transition-all duration-200 rounded-xl hover:bg-[#006A62]/5"
                onClick={(e) => handleScrollOrNavigate(e, "/", "about-us")}
              >
                About Us
                <ChevronDown className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/contactus"
                className="flex items-center justify-between p-3 text-[#006A62] hover:text-[#004A44] font-semibold transition-all duration-200 rounded-xl hover:bg-[#006A62]/5"
                onClick={(e) => handleScrollOrNavigate(e, "/contactus")}
              >
                Contact Us
                <ChevronDown className="w-4 h-4 opacity-50" />
              </Link>

              <div className="pt-4 border-t border-[#006A62]/10 space-y-3">
                {auth.user?.role === "admin" ? (
                  <Link
                    href={route('admin.dashboard')}
                    className="block w-full p-3 text-center rounded-xl border-2 border-[#006A62] text-[#006A62] font-semibold hover:bg-[#006A62] hover:text-white transition-all duration-200"
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </Link>
                ) : auth.user?.role === "instructor" ? (
                  <Link
                    href={route('instructor.dashboard')}
                    className="block w-full p-3 text-center rounded-xl border-2 border-[#006A62] text-[#006A62] font-semibold hover:bg-[#006A62] hover:text-white transition-all duration-200"
                    onClick={toggleMenu}
                  >
                    Instructor Panel
                  </Link>
                ) : auth.user?.role === "student" ? (
                  <Link
                    href={route('student.dashboard')}
                    className="block w-full p-3 text-center rounded-xl border-2 border-[#006A62] text-[#006A62] font-semibold hover:bg-[#006A62] hover:text-white transition-all duration-200"
                    onClick={toggleMenu}
                  >
                    Student Portal
                  </Link>
                ) : (
                  <div className="space-y-3">
                  
                    <Link
                      href={route('login')}
                      className="block w-full p-3 text-center rounded-xl bg-gradient-to-r from-[#F88F60] to-[#e77d4d] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
                      onClick={toggleMenu}
                    >
                      Login
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
