import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import courseService from "../services/Course";
import orderService from "../services/Order";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setcurrentCourse } from "../redux/reducers/CourseReducer";
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
  const navigate = useNavigate();

  const { currentCourse } = useSelector((state) => state.course);
  const { currentUser, isLoggedin } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Fetch course details
  useQuery({
    queryKey: ["fetchsinglecourse", courseId],
    queryFn: async () => {
      try {
        const res = await courseService.getSingleCourse(courseId);
        dispatch(setcurrentCourse(res.data));
      } catch (err) {
        console.log(err?.response?.data?.message);
      }
    },
  });

  // Fetch order for this course
  useQuery({
    queryKey: ["fetchsingleorder", courseId],
    queryFn: async () => {
      try {
        const res = await orderService.getOneOrder(courseId);
        setCurrentOrder(res.data);
      } catch (err) {
        console.log(err?.response?.data?.message);
      }
    },
  });

  // Check if user already rated
  useEffect(() => {
    if (currentCourse?._id && currentUser?._id) {
      const rated = currentCourse.ratings?.some(
        (r) => r.user.toString() === currentUser._id.toString()
      );
      setRatingSubmitted(rated);
    }
  }, [currentCourse, currentUser]);

  // Enrollment handler
  async function handleEnrollment() {
    setLoading(true);
    try {
      // simulate delay
      await new Promise((r) => setTimeout(r, 500));
      navigate(`/payment/${currentCourse._id}`);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
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
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  }

  function toTitleCase(text) {
    return text
      ?.split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  }

  return (
    <div className={`${darkMode ? "bg-gray-900" : "bg-gray-50"} min-h-screen`}> 
      {/* Hero Banner */}
      <div className="relative">
        <div className="w-full h-64 sm:h-72 md:h-80 lg:h-96 bg-gray-300"></div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <Link
                to="/course-display"
                onClick={() => dispatch(setcurrentCourse({}))}
                className="inline-flex items-center text-white bg-black bg-opacity-30 hover:bg-opacity-40 px-3 py-1 rounded-md mb-4 text-sm"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Link>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                {currentCourse?.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white text-sm sm:text-base">
                <span>{
                  currentCourse?.studentsEnrolled?.length === 1
                    ? '1 Student'
                    : `${currentCourse?.studentsEnrolled?.length || 0} Students`
                }</span>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-300 mr-1" />
                  <span>{currentCourse?.duration} weeks</span>
                </div>
                <div className="flex items-center">
                  <BarChart className="h-5 w-5 text-gray-300 mr-1" />
                  <span>{currentCourse?.level}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-gray-300 mr-1" />
                  <span>{toTitleCase(currentCourse?.category)}</span>
                </div>
                <span className="block sm:inline">Instructor: {currentCourse?.instructor?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Description Column */}
          <div className="lg:col-span-2 space-y-6">
            <section className={`${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} rounded-lg p-6 shadow`}>\
n              <h2 className="text-2xl font-bold mb-4">About This Course</h2>
              <p className="text-sm sm:text-base leading-relaxed">{currentCourse?.description}</p>
            </section>

            <section className={`${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} rounded-lg p-6 shadow`}>\
n              <h3 className="text-xl font-semibold mb-4">What You'll Learn</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentCourse?.courseOutcome?.map((item, idx) => (
                  <div key={idx} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Rating Section */}
            {currentCourse?._id && !ratingSubmitted && (
              <section className={`${darkMode ? "bg-gray-800" : "bg-gray-100"} rounded-lg p-6 shadow`}>\
n                <h3 className="text-xl font-semibold mb-3">Rate this course</h3>
                <div className="flex items-center mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <button key={star} onClick={() => handleStarClick(star)} className="focus:outline-none mx-1">
                      <Star fill={star <= userRating ? "currentColor" : "none"} className={`${star <= userRating ? "text-yellow-400" : "text-gray-400"} h-6 w-6`} />
                    </button>
                  ))}
                </div>
                <button onClick={handleSubmitRating} disabled={userRating===0} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                  Submit Rating
                </button>
              </section>
            )}
          </div>

          {/* Sidebar Column */}
          <aside className="lg:col-span-1 space-y-6">
            <div className={`${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} rounded-lg p-6 shadow sticky top-4`}>\
n              {currentCourse.studentsEnrolled?.includes(currentUser?._id) && isLoggedin ? (
                <Link to={`/classroom/${courseId}`} className="w-full block text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded">
                  Go to Classroom
                </Link>
              ) : (
                <>
                  <div className="text-2xl font-bold mb-4">Price: ₹{currentCourse?.price}</div>
                  <button onClick={handleEnrollment} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded mb-4 flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 mr-2" /> Enroll Now
                  </button>
                </>
              )}

              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <span>{currentCourse?.duration} weeks</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-400 mr-2" />
                  <span>{currentCourse?.studentsEnrolled?.length || 0} enrolled</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> Full lifetime access
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> Access on mobile & desktop
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> Certificate of completion
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> Downloadable resources
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CourseDescription;
