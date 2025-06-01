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
import orderService from "../services/Order";

const CourseDescription = () => {
  const { darkMode } = useContext(ThemeDataContext);
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { currentCourse } = useSelector((state) => state.course);
  const [loading, setloading] = useState(false);
  let navigate = useNavigate();
  let { currentUser } = useSelector((state) => state.user);
  const [currentOrder, setcurrentOrder] = useState(null);

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
        return;
      }
    },
  });

  useQuery({
    queryKey: ["fetchsingleorder"],
    queryFn: async () => {
      try {
        let order = await orderService.getOneOrder(courseId);
        return setcurrentOrder(order.data);
      } catch (error) {
        console.log(error?.response?.data?.message);
      }
    },
  });

  async function handleEnrollment() {
    setloading(true);
    new Promise((res, rej) => setTimeout(res, 4000));
    try {
      await courseService.enrollInCourse(courseId);
      setloading(false);
      navigate(`/payment/${currentCourse?._id}`);
    } catch (error) {
      setloading(false);
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

  function changeToTitleCase(word) {
    if (!word || typeof word !== "string") return;

    let splitted = word.split(" ");
    let newWordArr = splitted.map((each, index) => {
      return each.charAt(0).toUpperCase() + each.slice(1).toLowerCase();
    });

    return newWordArr.join(" ");
  }

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
                to="/course-display"
                className="inline-flex items-center text-white bg-black bg-opacity-30 hover:bg-opacity-40 py-2 rounded-lg mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {currentCourse?.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white">
                <div className="flex items-center">
                  <span className="ml-1">
                    {currentCourse?.studentsEnrolled?.length === 0 ||
                    currentCourse?.studentsEnrolled?.length === 1
                      ? `${currentCourse?.studentsEnrolled?.length} Student`
                      : `${currentCourse?.studentsEnrolled?.length} Students`}
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
                  <span className="ml-1">
                    {changeToTitleCase(currentCourse?.category)}
                  </span>
                </div>
                <div>
                  <span className="ml-1 text-lg font-semibold">
                    Created By: {currentCourse?.instructor?.name}
                  </span>
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
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  What You'll Learn
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentCourse?.courseOutcome?.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Interactive Star Rating Component */}
              {currentCourse?._id && ratingSubmitted === false && (
                <div
                  className="mt-8 p-4 rounded-xl shadow-sm"
                  style={{ backgroundColor: darkMode ? "#2d3748" : "#f7fafc" }}
                >
                  <h3 className="text-xl font-bold mb-4">Rate this course</h3>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleStarClick(star)}
                        className="focus:outline-none mr-3 mb-4"
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
                    disabled={userRating === 0 || ratingSubmitted}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                  >
                    {ratingSubmitted ? "Rated" : "Submit Rating"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div
              className={`rounded-xl shadow-sm p-6 sticky top-8 ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              }`}
            >
              {currentCourse?.studentsEnrolled?.includes(currentUser?._id) &&
              (currentOrder?.paymentStatus !== "Pending" ||
                currentCourse?.paymentStatus !== "Failed") ? (
                <Link
                  to={`/classroom/${courseId}`}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl mb-4 flex items-center justify-center"
                >
                  Go to Classroom
                </Link>
              ) : (
                <>
                  <div className="text-3xl font-bold mb-4">
                    Price: ₹ {currentCourse?.price}
                  </div>
                  <button
                    onClick={handleEnrollment}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl mb-4 flex items-center justify-center"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Enroll Now
                    {loading && <span className="loader ml-2"></span>}
                  </button>
                </>
              )}

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
