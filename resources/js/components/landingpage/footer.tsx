import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-teal-600 text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/assets/LogoWhite.jfif" alt="NeuroNest Logo" className="h-12 w-auto" />
            </div>
            <p className="text-teal-100 text-sm leading-relaxed">
              Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum blandit nibh et commodo consequat.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: 'Home', href: '#' },
                { name: 'About Us', href: '#about-us', onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleScroll(e, 'about-us') },
                { name: 'Contact Us', href: '/contactus' },
                { name: 'Login', href: '#' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={link.onClick}
                    className="text-teal-100 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect With Us Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect With Us!</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-teal-200" />
                <span className="text-teal-100 text-sm">news@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-teal-200" />
                <span className="text-teal-100 text-sm">123-123-123-123</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-teal-200" />
                <span className="text-teal-100 text-sm">123 NeuroNest St., Tech City</span>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-sm font-medium mb-3">Social Media</h4>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center hover:bg-teal-400 transition-colors duration-200"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4 text-white" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center hover:bg-teal-400 transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4 text-white" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center hover:bg-teal-400 transition-colors duration-200"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4 text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-teal-500 mt-8 pt-6 text-center">
          <p className="text-teal-200 text-sm">
            Copyright © NeuroNest - All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;