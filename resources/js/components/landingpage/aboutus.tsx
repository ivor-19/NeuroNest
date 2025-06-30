import { Target, Eye, Lightbulb, Globe, BookOpen, Users, Award } from "lucide-react"

export default function AboutUs() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content - Text */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium mb-4">
                <Globe className="w-4 h-4 mr-2" />
                ABOUT US
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6">
                Educate the populace to advance the nation
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                We are committed to providing world-class education that empowers students to become leaders in their
                fields and contribute meaningfully to society.
              </p>
            </div>

            {/* Mission and Vision */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Mission</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  To become the leading digital nest for lifelong learners, empowering individuals and institutions
                  through intelligent, accessible, and innovative learning experiences
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Vision</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Neuronest is dedicated to transforming education by providing a smart, user-friendly, and inclusive
                  learning management system that fosters collaboration, nurtures knowledge, and adapts to the diverse
                  needs of students, educators, and organizations.
                </p>
              </div>
            </div>
          </div>

          {/* Right Content - Visual Elements */}
          <div className="relative">
            <div className="space-y-6">
              {/* Main Card */}
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-3xl p-8 border border-teal-200">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl flex items-center justify-center">
                    <Lightbulb className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Innovation</h3>
                    <p className="text-slate-600">Driving educational excellence</p>
                  </div>
                </div>
                <p className="text-slate-700">
                  We believe in transforming education through innovative technology and personalized learning
                  experiences that adapt to every learner's unique journey.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900">Interactive Learning</h4>
                      <p className="text-sm text-slate-600">Engaging multimedia content and real-time collaboration</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900">Community</h4>
                        <p className="text-sm text-slate-600">Connect & collaborate</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900">Excellence</h4>
                        <p className="text-sm text-slate-600">Quality education</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full opacity-20 animate-pulse" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full opacity-10 animate-pulse" />
            <div className="absolute top-1/2 -right-8 w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full opacity-15 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
