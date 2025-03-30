import React from 'react';
import Navbar from './Navbar';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Nearby Implants</h3>
              <p className="text-gray-400 text-sm">
                Connecting patients with qualified implant dentists nationwide.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/about" className="text-gray-400 hover:text-white">About Us</a>
                </li>
                <li>
                  <a href="/search" className="text-gray-400 hover:text-white">Find a Provider</a>
                </li>
                <li>
                  <a href="/education" className="text-gray-400 hover:text-white">Patient Education</a>
                </li>
                <li>
                  <a href="/for-dentists" className="text-gray-400 hover:text-white">For Dentists</a>
                </li>
              </ul>
            </div>

            {/* Popular Locations */}
            <div>
              <h3 className="text-lg font-bold mb-4">Popular Locations</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/locations/new-york" className="text-gray-400 hover:text-white">New York</a>
                </li>
                <li>
                  <a href="/locations/los-angeles" className="text-gray-400 hover:text-white">Los Angeles</a>
                </li>
                <li>
                  <a href="/locations/chicago" className="text-gray-400 hover:text-white">Chicago</a>
                </li>
                <li>
                  <a href="/locations/houston" className="text-gray-400 hover:text-white">Houston</a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-400">
                  <Mail className="h-5 w-5 mr-2" />
                  <a href="mailto:contact@nearbyimplants.com">contact@nearbyimplants.com</a>
                </li>
                <li className="flex items-center text-gray-400">
                  <Phone className="h-5 w-5 mr-2" />
                  <a href="tel:1-800-IMPLANTS">1-800-IMPLANTS</a>
                </li>
                <li className="flex items-center text-gray-400">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>123 Main St, Suite 100<br />New York, NY 10001</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="text-center text-gray-400 text-sm">
              <p>&copy; {new Date().getFullYear()} Nearby Implants. All rights reserved.</p>
              <div className="mt-2">
                <a href="/privacy" className="hover:text-white">Privacy Policy</a>
                <span className="mx-2">|</span>
                <a href="/terms" className="hover:text-white">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 