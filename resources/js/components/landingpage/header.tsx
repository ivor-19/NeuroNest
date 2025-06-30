import { useState } from "react"
import { ArrowRight, Menu, X, GraduationCap } from "lucide-react"
import { Link, usePage } from "@inertiajs/react"
import { SharedData } from "@/types"

interface HeaderProps {
  onNavigate?: (sectionId: string) => void
}

// Define the possible user roles
type UserRole = 'admin' | 'instructor' | 'student'

// Define the role configuration type
interface RoleConfig {
  route: string
  label: string
}

// Define the complete role configuration map
const roleConfigMap: Record<UserRole, RoleConfig> = {
  admin: { route: route('admin.dashboard'), label: 'Dashboard' },
  instructor: { route: route('instructor.dashboard'), label: 'Instructor Panel' },
  student: { route: route('student.dashboard'), label: 'Student Portal' },
}

export default function Header({ onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { auth } = usePage<SharedData>().props

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleScroll = (sectionId: string) => {
    if (onNavigate) {
      onNavigate(sectionId)
    }
    setIsMenuOpen(false)
  }

  // Safely get the role config
  const getRoleConfig = (role: string): RoleConfig | null => {
    return roleConfigMap[role as UserRole] || null
  }

  const roleConfig = auth.user ? getRoleConfig(auth.user.role) : null

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">NeuroNest</h1>
              <p className="text-xs text-slate-600 font-medium">Learning Platform</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button
              onClick={() => handleScroll("hero")}
              className="text-slate-700 hover:text-teal-600 font-medium transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => handleScroll("courses")}
              className="text-slate-700 hover:text-teal-600 font-medium transition-colors cursor-pointer"
            >
              Courses
            </button>
            <button
              onClick={() => handleScroll("about")}
              className="text-slate-700 hover:text-teal-600 font-medium transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => handleScroll("contact")}
              className="text-slate-700 hover:text-teal-600 font-medium transition-colors cursor-pointer"
            >
              Contact Us
            </button>
          </nav>

          {/* Desktop Auth Button */}
          <div className="hidden lg:flex">
            {auth.user ? (
              roleConfig ? (
                <Link
                  href={roleConfig.route}
                  className="cursor-pointer inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                  onClick={toggleMenu}
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <span className="relative">{roleConfig.label}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              ) : null
            ) : (
              <Link
                href={route('login')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                onClick={toggleMenu}
              >
                <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                <span className="relative">Login</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button onClick={toggleMenu} className="p-2 text-slate-700 hover:text-teal-600 transition-colors">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200">
            <nav className="space-y-2">
              <button
                onClick={() => handleScroll("hero")}
                className="block w-full text-left px-4 py-2 text-slate-700 hover:text-teal-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                Home
              </button>
              <button
                onClick={() => handleScroll("courses")}
                className="block w-full text-left px-4 py-2 text-slate-700 hover:text-teal-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                Courses
              </button>
              <button
                onClick={() => handleScroll("about")}
                className="block w-full text-left px-4 py-2 text-slate-700 hover:text-teal-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                About
              </button>
              <button
                onClick={() => handleScroll("contact-form")}
                className="block w-full text-left px-4 py-2 text-slate-700 hover:text-teal-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                Contact
              </button>
              <div className="pt-2 mt-4 border-t border-slate-200">
                {auth.user ? (
                  roleConfig ? (
                    <Link
                      href={roleConfig.route}
                      className="group relative overflow-hidden rounded-xl border-2 border-white/30 px-6 py-2.5 text-sm font-semibold text-white hover:border-white/50 transition-all duration-300 hover:scale-105"
                      onClick={toggleMenu}
                    >
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      <span className="relative">{roleConfig.label}</span>
                    </Link>
                  ) : null
                ) : (
                  <Link
                    href={route('login')}
                    className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#F88F60] to-[#e77d4d] px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    onClick={toggleMenu}
                  >
                    <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                    <span className="relative">Login</span>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}