import React, { useContext } from "react";
import { Search } from "lucide-react";
import { ThemeDataContext } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import CourseCard from "../components/CourseCard";

const CourseDisplay = () => {
  const { darkMode } = useContext(ThemeDataContext);

  let { allCourses } = useSelector((state) => state.course);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Navbar />
      {/* Hero Section */}
      <div
        className={`${
          darkMode
            ? "bg-gradient-to-r from-indigo-800 to-purple-800"
            : "bg-gradient-to-r from-indigo-600 to-purple-600"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Explore Our Courses
          </h1>
          <p className="text-indigo-100 text-xl max-w-3xl">
            Discover a world of knowledge with our expertly crafted courses.
            Start your learning journey today and transform your future.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search courses..."
                className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 ${
                  darkMode
                    ? "border-gray-700 bg-gray-800 text-white"
                    : "border-gray-200 bg-white text-gray-900"
                } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              className={`px-4 py-3 rounded-xl border-2 ${
                darkMode
                  ? "border-gray-700 bg-gray-800 text-white"
                  : "border-gray-200 bg-white text-gray-900"
              } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            >
              <option value="">All Categories</option>
            </select>
            <select
              className={`px-4 py-3 rounded-xl border-2 ${
                darkMode
                  ? "border-gray-700 bg-gray-800 text-white"
                  : "border-gray-200 bg-white text-gray-900"
              } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            >
              <option value="">All Levels</option>
            </select>
          </div>
        </div>

        {/* Course Grid */}

        <div className="w-full flex gap-5 flex-wrap">
          {allCourses?.map((course) => (
            <CourseCard course = {course}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDisplay;
