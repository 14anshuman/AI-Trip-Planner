import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-400 text-gray-900 py-8 mt-10 rounded-t-4xl">
      {/* Content wrapper with max width but background is full */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-black">TripPlanner</h2>
          <p className="text-sm mt-2 text-gray-900">
            Explore the world, one trip at a time.  
            Plan smarter, travel better.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-black mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/about" className="hover:text-white transition">
                About Us
              </a>
            </li>
            <li>
              <a href="/trips" className="hover:text-white transition">
                Trips
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-white transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-black mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white text-xl">
              <FaFacebook />
            </a>
            <a href="#" className="hover:text-white text-xl">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-white text-xl">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-white text-xl">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} TripPlanner. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
