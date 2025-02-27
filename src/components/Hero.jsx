import React, { useContext } from "react";
import { ThemeDataContext } from "../context/ThemeContext";
import { Link } from "react-router-dom";

const Hero = () => {
  const {darkMode} = useContext(ThemeDataContext)
  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold">
          Transform Your Learning Journey
        </h1>
        <p
          className={`mt-4 text-xl ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Access world-class education from anywhere, at any time.
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          <Link to={'/course-display'} className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
            Get Started
          </Link>
          <button
            className={`px-6 py-3 border rounded-lg transition-colors duration-200 ${
              darkMode
                ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
