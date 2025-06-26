import React from 'react';
import { Hammer, Cog, Cpu, Zap } from 'lucide-react';

const Courses = () => {
  const programs = [
    {
      id: 1,
      title: 'BSCE',
      icon: <Hammer className="w-8 h-8 text-orange-500" />,
      bgColor: 'bg-orange-100',
      description:
        'A degree focused on designing, constructing and maintaining infrastructures like roads, bridges, buildings, and water systems.',
    },
    {
      id: 2,
      title: 'BSME',
      icon: <Cog className="w-8 h-8 text-blue-500" />,
      bgColor: 'bg-blue-100',
      description:
        'A degree centered on the design, analysis, and manufacturing of mechanical systems including engines, machines, and thermal systems.',
    },
    {
      id: 3,
      title: 'BSCPE',
      icon: <Cpu className="w-8 h-8 text-green-500" />,
      bgColor: 'bg-green-100',
      description:
        'A degree that combines computer systems and electrical engineering, focusing on hardware design and system integration.',
    },
    {
      id: 4,
      title: 'BSEE',
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      bgColor: 'bg-yellow-100',
      description:
        'A degree focused on the study and application of electricity, electronics, and electromagnetic systems that power our modern world.',
    },
  ];

  return (
    <div className="min-h-full py-10 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/assets/LogoNeuroNest.png"
              alt="NeuroNest Logo"
              className="w-40 h-20 object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Explore and Learn with this Platform.
          </h2>
          <p className="text-gray-600">For everyone of you can Programs</p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {programs.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1 min-h-[320px] flex flex-col items-center text-center"
            >
              <div
                className={`mb-4 p-4 ${program.bgColor} rounded-full transition-transform duration-300 hover:scale-110`}
              >
                {program.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                {program.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {program.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;