import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    
  <footer className="w-full bg-white text-center py-6 shadow-inner">
  <p className="text-sm font-medium tracking-wide">
    <span className="text-blue-600">© {new Date().getFullYear()}</span>{" "}
    <span className="text-gray-700">AI Trip Planner</span>{" "}
    <span className="text-purple-600">· All Rights Reserved</span>
  </p>
  <p className="text-xs mt-2">
    Powered by{" "}
    <span className="font-semibold text-indigo-600">React</span> &{" "}
    <span className="font-semibold text-pink-600">Firebase</span>
  </p>
</footer>

  );
};

export default Footer;
