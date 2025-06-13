import React from 'react';

const AboutUs = () => {
  return (
    <div id="about-us" className="bg-gray-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content - Image */}
          <div className="lg:w-1/2">
            <div className="relative">
              <div className="aspect-[3/4] max-w-[400px] mx-auto bg-gradient-to-br from-[#F88F60] to-[#e77d4d] rounded-2xl flex items-center justify-center overflow-hidden">
                <img
                  src="/assets/educator1.jfif"
                  alt="Professional Educator"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>

          {/* Right Content - Text */}
          <div className="lg:w-1/2 space-y-8">
            {/* About Us Header */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2 tracking-wide">ABOUT US</h3>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Educate the populace to advance the nation
              </h1>
            </div>

            {/* Mission and Vision */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Mission */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>

              {/* Vision */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;