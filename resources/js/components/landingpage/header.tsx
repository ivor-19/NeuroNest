import { Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { useState } from 'react';

export default function Header() {
    const { auth } = usePage<SharedData>().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const currentUrl = usePage().url;

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleScrollOrNavigate = (e: React.MouseEvent<Element>, href: string, sectionId?: string) => {
        if (sectionId && currentUrl === href) {
            e.preventDefault();
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
                return;
            }
        }
        // Allow Inertia navigation for other cases
        toggleMenu();
    };

    return (
        <header className="w-full relative overflow-hidden py-3">
            <div className="absolute inset-0 bg-[#FFF5F0]"></div>
            <div className="hidden md:block absolute top-0 right-0 w-[35%] h-full bg-[#006A62] md:z-10"></div>
            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center space-x-12">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-32 h-32 rounded overflow-hidden flex items-center justify-center">
                                <img
                                    src="/assets/LogoNeuroNest.jfif"
                                    alt="NeuroNest Logo"
                                    className="w-32 h-32 object-contain"
                                />
                            </div>
                        </Link>
                        <nav className="hidden md:flex items-center space-x-8">
                            <Link
                                href="/"
                                className="text-[#006A62] hover:text-[#004A44] font-medium transition-colors"
                                onClick={(e) => handleScrollOrNavigate(e, '/')}>
                                Home
                            </Link>
                            <Link
                                href="/aboutus"
                                className="text-[#006A62] hover:text-[#004A44] font-medium transition-colors"
                                onClick={(e) => handleScrollOrNavigate(e, '/', 'about-us')}>
                                About Us
                            </Link>
                            <Link
                                href="/contactus"
                                className="text-[#006A62] hover:text-[#004A44] font-medium transition-colors"
                                onClick={(e) => handleScrollOrNavigate(e, '/contactus')}>
                                Contact Us
                            </Link>
                        </nav>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        {auth.user?.role === 'admin' ? (
                            <Link
                                href={route('admin.dashboard')}
                                className="inline-block rounded-sm border border-white/20 px-5 py-1.5 text-sm leading-normal text-white hover:border-white/40 transition-colors"
                                onClick={toggleMenu}>
                                Dashboard
                            </Link>
                        ) : auth.user?.role === 'teacher' ? (
                            <Link
                                href={route('teacher.dashboard')}
                                className="inline-block rounded-sm border border-white/20 px-5 py-1.5 text-sm leading-normal text-white hover:border-white/40 transition-colors"
                                onClick={toggleMenu}>
                                Teacher Panel
                            </Link>
                        ) : auth.user?.role === 'student' ? (
                            <Link
                                href={route('student.dashboard')}
                                className="inline-block rounded-sm border border-white/20 px-5 py-1.5 text-sm leading-normal text-white hover:border-white/40 transition-colors"
                                onClick={toggleMenu}>
                                Student Portal
                            </Link>
                        ) : (
                            <>
                             
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-lg bg-[#F88F60] px-5 py-1.5 text-sm font-medium text-white hover:bg-[#e77d4d]"
                                    onClick={toggleMenu}>
                                    Login
                                </Link>
                            </>
                        )}
                    </div>
                    <div className="md:hidden">
                        <button
                            type="button"
                            className="text-[#006A62] hover:text-[#004A44]"
                            onClick={toggleMenu}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <nav className="md:hidden bg-[#FFF5F0] px-4 py-4">
                        <div className="flex flex-col space-y-4">
                            <Link
                                href="/"
                                className="text-[#006A62] hover:text-[#004A44] font-medium transition-colors"
                                onClick={(e) => handleScrollOrNavigate(e, '/')}>
                                Home
                            </Link>
                            <Link
                                href="/"
                                className="text-[#006A62] hover:text-[#004A44] font-medium transition-colors"
                                onClick={(e) => handleScrollOrNavigate(e, '/', 'about-us')}>
                                About Us
                            </Link>
                            <Link
                                href="/contactus"
                                className="text-[#006A62] hover:text-[#004A44] font-medium transition-colors"
                                onClick={(e) => handleScrollOrNavigate(e, '/contactus')}>
                                Contact Us
                            </Link>

                            {auth.user?.role === 'admin' ? (
                                <Link
                                    href={route('admin.dashboard')}
                                    className="inline-block rounded-sm border border-[#006A62] px-5 py-1.5 text-sm leading-normal text-[#006A62] hover:bg-[#006A62] hover:text-white transition-colors"
                                    onClick={toggleMenu}>
                                    Dashboard
                                </Link>
                            ) : auth.user?.role === 'teacher' ? (
                                <Link
                                    href={route('teacher.dashboard')}
                                    className="inline-block rounded-sm border border-[#006A62] px-5 py-1.5 text-sm leading-normal text-[#006A62] hover:bg-[#006A62] hover:text-white transition-colors"
                                    onClick={toggleMenu}>
                                    Teacher Panel
                                </Link>
                            ) : auth.user?.role === 'student' ? (
                                <Link
                                    href={route('student.dashboard')}
                                    className="inline-block rounded-sm border border-[#006A62] px-5 py-1.5 text-sm leading-normal text-[#006A62] hover:bg-[#006A62] hover:text-white transition-colors"
                                    onClick={toggleMenu}>
                                    Student Portal
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="inline-block rounded-sm border border-[#006A62] px-5 py-1.5 text-sm leading-normal text-[#006A62] hover:bg-[#006A62] hover:text-white transition-colors"
                                        onClick={toggleMenu}>
                                        Sign in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-block rounded-lg bg-[#F88F60] px-5 py-1.5 text-sm font-medium text-white hover:bg-[#e77d4d]"
                                        onClick={toggleMenu}>
                                        Login
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}