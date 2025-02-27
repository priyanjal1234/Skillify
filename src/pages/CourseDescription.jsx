import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import courseService from "../services/Course";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setcurrentCourse } from "../redux/reducers/CourseReducer";
import { Link } from "react-router-dom";
import {
  Clock,
  Users,
  Star,
  BookOpen,
  BarChart,
  CheckCircle,
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";
import { ThemeDataContext } from "../context/ThemeContext";

const CourseDescription = () => {
  const { darkMode } = useContext(ThemeDataContext);
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { currentCourse } = useSelector((state) => state.course);

  useQuery({
    queryKey: ["fetchsinglecourse"],
    queryFn: async () => {
      try {
        const singleCourseRes = await courseService.getSingleCourse(courseId);
        return dispatch(setcurrentCourse(singleCourseRes.data));
      } catch (error) {
        console.log(error?.response?.data?.message);
      }
    },
  });

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="relative">
        <div className="w-full h-[300px] md:h-[400px] overflow-hidden">
          <div className="w-full h-full bg-gray-300"></div>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <Link
                onClick={() => dispatch(setcurrentCourse({}))}
                to={"/course-display"}
                className="inline-flex items-center text-white bg-black bg-opacity-30 hover:bg-opacity-40  py-2 rounded-lg mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {currentCourse?.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1">
                    {currentCourse?.rating?.average} Rating (
                    {currentCourse?.studentsEnrolled?.length} Students)
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-300" />
                  <span className="ml-1">{currentCourse?.duration} weeks</span>
                </div>
                <div className="flex items-center">
                  <BarChart className="h-5 w-5 text-gray-300" />
                  <span className="ml-1">{currentCourse?.level}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-gray-300" />
                  <span className="ml-1">{currentCourse?.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div
              className={`rounded-xl shadow-sm p-6 ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              }`}
            >
              <h2 className="text-2xl font-bold mb-4">About This Course</h2>
              <p>{currentCourse?.description}</p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div
              className={`rounded-xl shadow-sm p-6 sticky top-8 ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              }`}
            >
              <div className="text-3xl font-bold mb-4">
                Price: ₹ {currentCourse?.price}
              </div>
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl mb-4 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Enroll Now
              </button>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-3" />
                  <p>Duration: {currentCourse?.duration} weeks</p>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-400 mr-3" />
                  <p>
                    Students Enrolled: {currentCourse?.studentsEnrolled?.length}
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-medium mb-2">This course includes:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Full lifetime access
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Access on mobile and desktop
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Certificate of completion
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Downloadable resources
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDescription;
