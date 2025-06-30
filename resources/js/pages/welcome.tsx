import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import Header from '@/components/landingpage/header';
import Courses from '@/components/landingpage/courses';
import AboutUs from '@/components/landingpage/aboutus';
import Footer from '@/components/landingpage/footer';
import ChatSup from '@/components/landingpage/chatsup'; // Import the ChatSup component

export default function Welcome() {
  const { auth } = usePage<SharedData>().props;

  return (
    <>
      <Head title="Welcome">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link
          href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
          rel="stylesheet"
        />
      </Head>
      
      <div className="min-h-screen bg-[#FDFDFC] dark:bg-[#0a0a0a]">
        <Header />
        
        {/* Hero Section */}
        <section className="w-full relative overflow-hidden">
          {/* Light background (always visible) */}
          <div className="absolute inset-0 bg-[#FFF5F0]" />

          <div className="hidden lg:block absolute top-0 right-0 w-[35%] h-full bg-[#006A62] shadow-2xl"></div>
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* Left Content */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-[#006A62] leading-tight">
                    Build Your Skillswefwefwef
                    <br />
                    With the{' '}
                    <span className="inline-block bg-[#F88F60] text-white px-4 py-2 rounded-lg">
                      BEST
                    </span>
                    <br />
                    Learning Management System
                  </h1>

                  <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                    Unlock your full potential with a cutting-edge Learning
                    Management System designed for seamless, effective learning.
                    Access expert-led courses, monitor your progress, and gain
                    in-demand skills—all in one intuitive platform.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <Link
                    href={route('login')}
                    className="inline-block rounded-lg bg-[#F88F60] px-7 py-3 text-base font-medium text-white hover:bg-[#e77d4d]"
                  >
                    Login
                  </Link>

                  <div className="flex items-center space-x-4">
                    {/* Avatar group */}
                    <div className="flex -space-x-2">
                      {[
                        { src: '/assets/Student1.jfif', alt: 'A' },
                        { src: '/assets/student2.jfif', alt: 'B' },
                        { src: '/assets/student3.jfif', alt: 'C' },
                        { src: '/assets/student4.jfif', alt: 'D' },
                      ].map(({ src, alt }) => (
                        <div
                          key={alt}
                          className="w-10 h-10 rounded-full border-2 border-white overflow-hidden"
                        >
                          <img
                            src={src}
                            alt={alt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="text-sm">
                      <div className="font-semibold text-[#006A62]">200+ Smart</div>
                      <div className="text-gray-600">Students</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content - Image */}
              <div className="relative lg:ml-24">
                <div className="relative z-10">
                  {/* Slightly bigger background container */}
                  <div className="aspect-[3/4] max-w-[400px] max-h-[520px] bg-gradient-to-br from-[#F88F60] to-[#e77d4d] rounded-2xl flex items-center justify-center overflow-hidden">
                    <img
                      src="/assets/Educator.jfif"
                      alt="Professional Educator"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main content area */}
        <Courses />
        <AboutUs />

        {/* Add ChatSup component here or adjust placement as needed */}
        <ChatSup />

        <Footer />
      </div>
    </>
  );
}