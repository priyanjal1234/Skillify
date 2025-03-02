import React, { useContext } from "react";
import { ThemeDataContext } from "../context/ThemeContext";
import { Clock, Star, Users, ChevronRight } from "lucide-react";
import truncateText from "../utils/truncateText";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const CourseCard = ({ course }) => {
  let { darkMode } = useContext(ThemeDataContext);
  let { currentUser } = useSelector((state) => state.user);

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } w-[400px] rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300`}
    >
      {/* Course Thumbnail */}
      {course?.thumbnail !== "" && (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={course?.thumbnail}
            alt={course?.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center gap-4 justify-between mb-2">
          <span
            className={`text-sm font-medium px-3 py-1 rounded-full ${
              darkMode
                ? "bg-indigo-900 text-indigo-200"
                : "bg-indigo-100 text-indigo-800"
            }`}
          >
            {course?.level}
          </span>
          <span
            className={`text-sm font-medium px-3 py-1 rounded-full ${
              darkMode
                ? "bg-purple-900 text-purple-200"
                : "bg-purple-100 text-purple-800"
            }`}
          >
            {course?.category}
          </span>
        </div>
        <h3
          className={`text-xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          } mb-2`}
        >
          {course?.title}
        </h3>
        <p
          className={`text-gray-600 ${
            darkMode ? "dark:text-gray-300" : ""
          } mb-4`}
        >
          {truncateText(course?.description, 50)}
        </p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {course?.duration} weeks
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {course?.studentsEnrolled?.length === 0
                ? "0 Student"
                : course?.studentsEnrolled?.length === 1
                ? "1 Student"
                : `${course?.studentsEnrolled?.length} students`}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span
              className={`font-medium ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {course?.rating?.average}
            </span>
          </div>
          <Link
            to={`/course/${course?._id}`}
            className={`flex items-center space-x-2 ${
              darkMode
                ? "text-indigo-400 hover:text-indigo-500"
                : "text-indigo-600 hover:text-indigo-500"
            } font-medium`}
          >
            <span>View Details</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {course?.studentsEnrolled?.includes(currentUser?._id) ? (
          <Link
            to={`/classroom/${course?._id}`}
            className={`w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center`}
          >
            Go to Classroom
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default CourseCard;
