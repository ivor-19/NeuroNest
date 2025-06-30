import type React from "react"
import { Hammer, Cog, Cpu, Zap, GraduationCap } from "lucide-react"

interface Program {
  id: number
  title: string
  fullName: string
  icon: React.ReactNode
  bgColor: string
  description: string
}

export default function Courses() {
  const programs: Program[] = [
    {
      id: 1,
      title: "BSCE",
      fullName: "Civil Engineering",
      icon: <Hammer className="w-8 h-8" />,
      bgColor: "from-orange-500 to-orange-600",
      description: "Design, construct and maintain infrastructures like roads, bridges, buildings, and water systems.",
    },
    {
      id: 2,
      title: "BSME",
      fullName: "Mechanical Engineering",
      icon: <Cog className="w-8 h-8" />,
      bgColor: "from-blue-500 to-blue-600",
      description:
        "Design, analysis, and manufacturing of mechanical systems including engines, machines, and thermal systems.",
    },
    {
      id: 3,
      title: "BSCPE",
      fullName: "Computer Engineering",
      icon: <Cpu className="w-8 h-8" />,
      bgColor: "from-green-500 to-green-600",
      description:
        "Combines computer systems and electrical engineering, focusing on hardware design and system integration.",
    },
    {
      id: 4,
      title: "BSEE",
      fullName: "Electrical Engineering",
      icon: <Zap className="w-8 h-8" />,
      bgColor: "from-yellow-500 to-yellow-600",
      description:
        "Study and application of electricity, electronics, and electromagnetic systems that power our modern world.",
    },
  ]

  return (
    <section id="courses" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Explore and Learn with Our Platform</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose from our comprehensive engineering programs designed for your success
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((program) => (
            <div
              key={program.id}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-slate-300 transform hover:-translate-y-2"
            >
              <div
                className={`mb-6 p-4 bg-gradient-to-br ${program.bgColor} rounded-2xl text-white inline-flex group-hover:scale-110 transition-transform duration-300`}
              >
                {program.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{program.title}</h3>
              <h4 className="text-sm font-medium text-slate-600 mb-4">{program.fullName}</h4>
              <p className="text-slate-600 leading-relaxed text-sm">{program.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
