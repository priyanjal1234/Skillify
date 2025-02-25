import { useContext, useState } from "react";
import {
  ArrowLeft,
  BarChart,
  Clock,
  CheckCircle,
  Users,
  Star,
  Sun,
  Moon,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import courseService from "../services/Course";
import { toast } from "react-toastify";
import { ThemeDataContext } from "../context/ThemeContext";

const CoursePreview = () => {
  let { courseId } = useParams();
  let { darkMode } = useContext(ThemeDataContext);
  const [isPublishing, setIsPublishing] = useState(false);

  let navigate = useNavigate();

  let { allCourses } = useSelector((state) => state.course);

  let specificCourse =
    Array.isArray(allCourses) &&
    allCourses.filter((course) => course?._id === courseId)[0];

  async function handlePublishCourse() {
    setIsPublishing(true);

    try {
      await courseService.changeCourseStatus(specificCourse?._id, "Published");
      setIsPublishing(false);
    } catch (error) {
      setIsPublishing(false);
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/dashboard/instructor")}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Course Preview
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handlePublishCourse}
                disabled={isPublishing}
                className={`px-6 py-2 rounded-lg text-white font-medium flex items-center space-x-2 transition-colors duration-300 ${
                  isPublishing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                <CheckCircle className="h-5 w-5" />
                <span>{isPublishing ? "Publishing..." : "Publish Course"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-2xl overflow-hidden">
              <img
                src={specificCourse.thumbnail}
                alt={specificCourse.title}
                className="w-full h-[400px] object-cover"
              />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                About This Course
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {specificCourse.description}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Course Content
              </h2>
              <div className="space-y-4">
                {specificCourse?.lessons?.map((chapter, index) => (
                  <div
                    key={index}
                    className="border dark:border-gray-700 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {chapter.title}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {chapter?.duration}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {chapter.topics.map((topic, topicIndex) => (
                        <li
                          key={topicIndex}
                          className="text-gray-600 dark:text-gray-300 flex items-center"
                        >
                          <div className="h-2 w-2 bg-indigo-600 dark:bg-indigo-400 rounded-full mr-2" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Duration
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {specificCourse?.duration}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BarChart className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Level
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {specificCourse?.level}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Students
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {specificCourse?.studentsEnrolled?.length}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Rating
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {specificCourse.rating > 0
                      ? specificCourse.rating.toFixed(1)
                      : "Not rated"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Instructor
              </h3>
              <div className="flex items-center space-x-4">
                <img
                  src={`${specificCourse?.instructor?.profileImage}`}
                  alt={specificCourse.instructor}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {specificCourse?.instructor?.name}
                  </h4>
                  {/* <p className="text-sm text-gray-500 dark:text-gray-400">
                    Senior React Developer
                  </p> */}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Price</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₹{specificCourse.price}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;
