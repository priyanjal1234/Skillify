import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import courseService from "../services/Course";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setcurrentCourse } from "../redux/reducers/CourseReducer";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
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
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  let { currentUser } = useSelector((state) => state.user);

  // State for user rating and submission status
  const [userRating, setUserRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(null);

  useEffect(() => {
    if (currentCourse?._id && currentUser?._id) {
      const ratingPresent = currentCourse.ratings.find(
        (r) => r.user.toString() === currentUser._id.toString()
      );
      setRatingSubmitted(!!ratingPresent);
    }
  }, [currentCourse, currentUser]);

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

  async function handleEnrollment() {
    setLoading(true);
    setTimeout(() => setLoading(false), 4000);
    try {
      await courseService.enrollInCourse(courseId);
      navigate(`/payment/${currentCourse?._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  function handleStarClick(value) {
    setUserRating(value);
  }

  async function handleSubmitRating() {
    try {
      await courseService.rateCourse(courseId, userRating);
      toast.success("Thanks for your feedback");
      setRatingSubmitted(true);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Responsive Course Cover Image */}
      <div className="relative w-full h-[250px] md:h-[400px] overflow-hidden">
        <div className="w-full h-full bg-gray-300"></div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="max-w-3xl">
            <Link
              onClick={() => dispatch(setcurrentCourse({}))}
              to={"/course-display"}
              className="inline-flex items-center text-white bg-black bg-opacity-30 hover:bg-opacity-40 py-2 px-4 rounded-lg mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Link>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
              {currentCourse?.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-white text-sm md:text-base">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-300" />
                <span className="ml-1">
                  {currentCourse?.studentsEnrolled?.length} Students
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
              <div>
                <span className="text-lg font-semibold">
                  Created By: {currentCourse?.instructor?.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section: Course Details */}
          <div className="lg:col-span-2 space-y-6">
            <div
              className={`rounded-xl shadow-sm p-6 ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              }`}
            >
              <h2 className="text-2xl font-bold">About This Course</h2>
              <p>{currentCourse?.description}</p>

              {/* What You'll Learn Section */}
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-4">What You'll Learn</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentCourse?.courseOutcome?.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating Section */}
              {!ratingSubmitted && (
                <div className="mt-8 p-4 rounded-xl shadow-sm bg-gray-100 dark:bg-gray-700">
                  <h3 className="text-xl font-bold mb-4">Rate this course</h3>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleStarClick(star)}
                        className="mr-3"
                      >
                        <Star
                          fill={star <= userRating ? "currentColor" : "none"}
                          className={`h-6 w-6 ${
                            star <= userRating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleSubmitRating}
                    className="mt-2 bg-blue-600 text-white py-2 px-4 rounded"
                  >
                    Submit Rating
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Section: Enrollment Card */}
          <div className="lg:col-span-1 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <h2 className="text-3xl font-bold mb-4">
              Price: ₹ {currentCourse?.price}
            </h2>
            <button
              onClick={handleEnrollment}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDescription;
