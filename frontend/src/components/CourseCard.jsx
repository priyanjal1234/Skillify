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
  let { darkMode } = useContext(ThemeDataContext);
  let { currentUser, isLoggedin } = useSelector((state) => state.user);
  const [rating, setRating] = useState(0);
  const [currentOrder, setcurrentOrder] = useState(null);

  useQuery({
    queryKey: ["fetchsingleorder"],
    queryFn: async () => {
      try {
        let order = await orderService.getOneOrder(course?._id);
        return setcurrentOrder(order.data);
      } catch (error) {
        console.log(error?.response?.data?.message);
      }
    },
  });

  useQuery({
    queryKey: ["fetchCourseRating", course?._id],
    queryFn: async function () {
      try {
        let getRatingRes = await courseService.getCourseRating(course?._id);

        if (getRatingRes.status === 200) {
          setRating(Number(getRatingRes.data));
        }

        return getRatingRes.data;
      } catch (error) {
        console.log(error?.response?.data?.message);

        return false;
      }
    },
  });

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } w-[90%]   h-fit rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 `}
    >
      {/* Course Thumbnail */}
      {course?.thumbnail !== "" && (
        <div className="w-full h-40 sm:h-44 md:h-48 lg:h-52 overflow-hidden">
          <img
            src={course?.thumbnail}
            alt={course?.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4 sm:p-5 md:p-6">
        {/* Badges */}
        <div className="flex items-center gap-2 justify-between mb-2">
          <span
            className={`text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full ${
              darkMode
                ? "bg-indigo-900 text-indigo-200"
                : "bg-indigo-100 text-indigo-800"
            }`}
          >
            {course?.level}
          </span>
          <span
            className={`text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full ${
              darkMode
                ? "bg-purple-900 text-purple-200"
                : "bg-purple-100 text-purple-800"
            }`}
          >
            {course?.category}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`text-lg sm:text-xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          } mb-2`}
        >
          {course?.title}
        </h3>

        {/* Description */}
        <p
          className={`text-sm sm:text-base ${
            darkMode ? "text-gray-300" : "text-gray-600"
          } mb-4`}
        >
          {truncateText(course?.description, 50)}
        </p>

        {/* Duration & Students */}
        <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {course?.duration === 1
                ? `${course?.duration} week`
                : `${course?.duration} weeks`}
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

        {/* Rating & Link */}
        <div className="flex items-center justify-between">
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
            to={`/course/${course?._id}`}
            className={`flex items-center space-x-2 ${
              darkMode
                ? "text-indigo-400 hover:text-indigo-500"
                : "text-indigo-600 hover:text-indigo-500"
            } font-medium text-sm`}
          >
            <span>View Details</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Go to Classroom Button */}
        {course?.studentsEnrolled?.includes(currentUser?._id) && isLoggedin ? (
          <Link
            to={`/classroom/${course?._id}`}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center text-sm sm:text-base"
          >
            Go to Classroom
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default CourseCard;
