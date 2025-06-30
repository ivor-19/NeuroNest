import { Link } from "@inertiajs/react"
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, GraduationCap } from "lucide-react"

interface FooterProps {
  onNavigate?: (sectionId: string) => void
}

export default function Footer({ onNavigate }: FooterProps) {
  const handleScroll = (sectionId: string) => {
    if (onNavigate) {
      onNavigate(sectionId)
    }
  }

  return (
    <footer id="contact" className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">NeuroNest</h3>
                <p className="text-xs text-slate-400">Learning Platform</p>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Empowering students worldwide with cutting-edge education technology and innovative learning experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-3">
              <button
                onClick={() => handleScroll("hero")}
                className="block text-slate-400 hover:text-white transition-colors text-sm"
              >
                Home
              </button>
              <button
                onClick={() => handleScroll("courses")}
                className="block text-slate-400 hover:text-white transition-colors text-sm"
              >
                Courses
              </button>
              <button
                onClick={() => handleScroll("about")}
                className="block text-slate-400 hover:text-white transition-colors text-sm"
              >
                About Us
              </button>
              <Link href="/login" className="block text-slate-400 hover:text-white transition-colors text-sm">
                Login
              </Link>
            </div>
          </div>

          {/* Programs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Programs</h3>
            <div className="space-y-3 text-sm text-slate-400">
              <div>Civil Engineering</div>
              <div>Mechanical Engineering</div>
              <div>Computer Engineering</div>
              <div>Electrical Engineering</div>
            </div>
          </div>

          {/* Connect With Us */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect With Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400 text-sm">info@neuronest.edu</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400 text-sm">123 Education St., Tech City</span>
              </div>
            </div>

            <div className="pt-4">
              <h4 className="text-sm font-medium mb-3">Follow Us</h4>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-700 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-700 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-700 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 mt-12 pt-8 text-center">
          <p className="text-slate-400 text-sm">© 2025 NeuroNest Learning Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
