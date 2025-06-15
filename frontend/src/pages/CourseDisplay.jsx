import React, { useContext, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { ThemeDataContext } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import CourseCard from "../components/CourseCard";
import { useQuery } from "@tanstack/react-query";
import courseService from "../services/Course";
import { setAllCourses } from "../redux/reducers/CourseReducer";

const CourseDisplay = () => {
  const { darkMode } = useContext(ThemeDataContext);
  const dispatch = useDispatch();
  const { allCourses } = useSelector((state) => state.course);

  const [category, setCategory] = useState("");
  const [level, setlevel] = useState("");
  const [searchVal, setsearchVal] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Fetch published courses and initialize state
  useQuery({
    queryKey: ["getPublishedCourses"],
    queryFn: async () => {
      try {
        const res = await courseService.getPublishedCourses();
        dispatch(setAllCourses(res.data));
        setFilteredCourses(res.data);
        return res.data;
      } catch (error) {
        console.log(error?.response?.data?.message);
        return [];
      }
    },
  });

  // Filter logic whenever dependencies change
  useEffect(() => {
    function filterCourses() {
      let result = allCourses || [];
      if (category) {
        result = result.filter(
          (course) => course?.category?.toLowerCase() === category.toLowerCase()
        );
      }
      if (level) {
        result = result.filter(
          (course) => course?.level?.toLowerCase() === level.toLowerCase()
        );
      }
      if (searchVal) {
        result = result.filter((course) =>
          course?.title?.toLowerCase().includes(searchVal.toLowerCase())
        );
      }
      setFilteredCourses(result);
    }
    // Even if allCourses is empty array, we run filterCourses
    if (allCourses !== undefined) {
      filterCourses();
    }
  }, [allCourses, category, level, searchVal]);

  return (
    <div className={`${darkMode ? "bg-gray-900" : "bg-gray-50"} min-h-screen`}>
      <Navbar />

      {/* Hero Section */}
      <div
        className={`${
          darkMode
            ? "bg-gradient-to-r from-indigo-800 to-purple-800"
            : "bg-gradient-to-r from-indigo-600 to-purple-600"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 md:mb-4">
            Explore Our Courses
          </h1>
          <p className="text-indigo-100 text-base sm:text-lg md:text-xl max-w-3xl">
            Discover a world of knowledge with our expertly crafted courses.
            Start your learning journey today and transform your future.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                value={searchVal}
                onChange={(e) => setsearchVal(e.target.value)}
                type="text"
                placeholder="Search courses by title..."
                className={`w-full pl-10 pr-4 py-2 md:py-3 rounded-lg md:rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base ${
                  darkMode
                    ? "border-gray-700 bg-gray-800 text-white placeholder-gray-400"
                    : "border-gray-200 bg-white text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>
          </div>
          {/* Category & Level Selects */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full sm:w-auto px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base ${
                darkMode
                  ? "border-gray-700 bg-gray-800 text-white"
                  : "border-gray-200 bg-white text-gray-900"
              }`}
            >
              <option value="">All Categories</option>
              <option value="programming">Programming</option>
              <option value="data science">Data Science</option>
              <option value="web development">Web Development</option>
              <option value="mobile development">Mobile Development</option>
              <option value="ui/ux design">UI/UX Design</option>
              <option value="cybersecurity">Cybersecurity</option>
              <option value="cloud computing">Cloud Computing</option>
              <option value="artificial intelligence & machine learning">
                Artificial Intelligence & Machine Learning
              </option>
              <option value="business & entrepreneurship">
                Business & Entrepreneurship
              </option>
              <option value="digital marketing">Digital Marketing</option>
              <option value="graphic design">Graphic Design</option>
              <option value="photography & video editing">
                Photography & Video Editing
              </option>
            </select>
            <select
              value={level}
              onChange={(e) => setlevel(e.target.value)}
              className={`w-full sm:w-auto px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base ${
                darkMode
                  ? "border-gray-700 bg-gray-800 text-white"
                  : "border-gray-200 bg-white text-gray-900"
              }`}
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Course Grid: responsive columns */}
        <div className="flex flex-wrap gap-6">
          {filteredCourses?.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard key={course?._id} course={course} />
            ))
          ) : (
            <p
              className={`col-span-full text-center text-base md:text-lg ${
                darkMode ? "text-gray-300" : "text-gray-500"
              }`}
            >
              No courses available at the moment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDisplay;
