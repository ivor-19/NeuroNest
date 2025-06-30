
import AboutUs from "@/components/landingpage/aboutus"
import ContactUs from "@/components/landingpage/contactus"
import Courses from "@/components/landingpage/courses"
import Footer from "@/components/landingpage/footer"
import Header from "@/components/landingpage/header"
import { Link } from "@inertiajs/react"
import { ArrowRight, BookOpen, Users, Award, CheckCircle, Star } from "lucide-react"

export default function Welcome() {
  const handleNavigation = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onNavigate={handleNavigation} />
      <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-white">
      {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-teal-600/10 to-transparent" />
          <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-tr from-orange-500/10 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-medium">
                  <Star className="w-4 h-4 mr-2" />
                  #1 Learning Platform
                </div>

                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-tight">
                  Build Your Skills
                  <br />
                  With the{" "}
                  <span className="relative">
                    <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                      BEST
                    </span>
                    <div className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-orange-500/30 to-orange-600/30 rounded-full" />
                  </span>
                  <br />
                  Learning Management System
                </h1>

                <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                  Unlock your full potential with a cutting-edge Learning Management System designed for seamless,
                  effective learning. Access expert-led courses, monitor your progress, and gain in-demand skills—all in
                  one intuitive platform.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <Link
                  href="/login"
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border-2 border-white flex items-center justify-center"
                        >
                          <Users className="w-4 h-4 text-slate-600" />
                        </div>
                      ))}
                    </div>
                    <div className="text-sm ml-3">
                      <div className="font-semibold text-slate-900">200+ Smart</div>
                      <div className="text-slate-600">Students</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Visual Elements */}
            <div className="relative">
              <div className="relative z-10 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-900">50+</div>
                        <div className="text-sm text-slate-600">Courses</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-900">95%</div>
                        <div className="text-sm text-slate-600">Success Rate</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feature List */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Why Choose Us?</h3>
                  <div className="space-y-3">
                    {["Expert-led courses", "Progress tracking", "Interactive learning", "Certificate completion"].map(
                      (feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-teal-600" />
                          <span className="text-slate-700">{feature}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full opacity-20 animate-pulse" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full opacity-10 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Courses />
      <AboutUs />
      <ContactUs />
      {/* <CallToAction /> */}
      <Footer onNavigate={handleNavigation} />
    </div>
  )
}
