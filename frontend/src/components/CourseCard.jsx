import React, { useContext, useState } from "react";
import { ThemeDataContext } from "../context/ThemeContext";
import { Clock, Star, Users, ChevronRight } from "lucide-react";
import truncateText from "../utils/truncateText";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import courseService from "../services/Course";
import orderService from "../services/Order";

const CourseCard = ({ course }) => {
  const { darkMode } = useContext(ThemeDataContext);
  const { currentUser, isLoggedin } = useSelector((state) => state.user);
  const [rating, setRating] = useState(0);
  const [currentOrder, setcurrentOrder] = useState(null);

  // Fetch single order if exists (business logic unchanged)
  useQuery({
    queryKey: ["fetchsingleorder", course?._id],
    queryFn: async () => {
      try {
        const order = await orderService.getOneOrder(course?._id);
        setcurrentOrder(order.data);
      } catch (error) {
        console.log(error?.response?.data?.message);
      }
    },
  });

  // Fetch rating (business logic unchanged)
  useQuery({
    queryKey: ["fetchCourseRating", course?._id],
    queryFn: async () => {
      try {
        const res = await courseService.getCourseRating(course?._id);
        if (res.status === 200) {
          setRating(Number(res.data));
        }
      } catch (error) {
        console.log(error?.response?.data?.message);
      }
    },
  });

  return (
    <div
      className={`flex flex-col w-[400px] sm:w-[380px] h-fit bg-white dark:bg-gray-800
                  rounded-2xl shadow-md hover:shadow-lg transition-shadow`}
    >
      {/* Thumbnail */}
      {course?.thumbnail && (
        <div className="w-full h-40 sm:h-44 md:h-48 lg:h-52 xl:h-56 overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-1">
        {/* Badges */}
        <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
          <span
            className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full ${
              darkMode
                ? "bg-indigo-900 text-indigo-200"
                : "bg-indigo-100 text-indigo-800"
            }`}
          >
            {course.level}
          </span>
          <span
            className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full ${
              darkMode
                ? "bg-purple-900 text-purple-200"
                : "bg-purple-100 text-purple-800"
            }`}
          >
            {course.category}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`font-bold mb-2 text-base sm:text-lg md:text-xl ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {course.title}
        </h3>

        {/* Description */}
        <p
          className={`text-sm sm:text-base mb-4 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {truncateText(course.description, 60)}
        </p>

        {/* Duration & Students */}
        <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-gray-400" />
            <span
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {course.duration === 1
                ? `${course.duration} week`
                : `${course.duration} weeks`}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4 text-gray-400" />
            <span
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {course.studentsEnrolled?.length === 0
                ? "0 Student"
                : course.studentsEnrolled?.length === 1
                ? "1 Student"
                : `${course.studentsEnrolled.length} students`}
            </span>
          </div>
        </div>

        {/* Rating & Details Link */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {Number(rating).toFixed(1)}
            </span>
          </div>
          <Link
            to={`/course/${course._id}`}
            className={`flex items-center space-x-1 text-sm font-medium ${
              darkMode
                ? "text-indigo-400 hover:text-indigo-500"
                : "text-indigo-600 hover:text-indigo-500"
            }`}
          >
            <span>View Details</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Spacer pushes button to bottom */}
        <div className="mt-auto">
          {course.studentsEnrolled?.includes(currentUser?._id) &&
            isLoggedin && (
              <Link
                to={`/classroom/${course._id}`}
                className="w-full block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl text-center text-sm sm:text-base transition-colors"
              >
                Go to Classroom
              </Link>
            )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
