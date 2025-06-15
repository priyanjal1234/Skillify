import React, { useContext } from "react";
import { ThemeDataContext } from "../context/ThemeContext";
import { Link } from "react-router-dom";

const Hero = () => {
  const { darkMode } = useContext(ThemeDataContext);
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-[poppins] leading-tight">
          Transform Your Learning Journey
        </h1>
        <p
          className={`mt-4 text-lg sm:text-xl md:text-2xl font-[jost] ${
            darkMode ? "text-gray-300" : "text-gray-600"
          } max-w-3xl mx-auto`}
        >
          Access world-class education from anywhere, at any time.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to={"/course-display"}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 w-full sm:w-auto"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
