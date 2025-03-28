import React, { useContext } from "react";
import { ThemeDataContext } from "../context/ThemeContext";
import { Link } from "react-router-dom";

const Hero = () => {
  const { darkMode } = useContext(ThemeDataContext);

  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight font-[poppins]">
          Transform Your Learning Journey
        </h1>
        <p
          className={`mt-4 font-[jost] text-lg sm:text-xl ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Access world-class education from anywhere, at any time.
        </p>
        
        {/* Buttons - Stack on small screens, align horizontally on larger screens */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link
            to={"/course-display"}
            className="px-6 py-3 w-full sm:w-auto bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Get Started
          </Link>
          <button
            className={`px-6 py-3 w-full sm:w-auto border rounded-lg transition-colors duration-200 ${
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
