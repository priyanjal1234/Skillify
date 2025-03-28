import { useContext, useEffect, useState } from "react";
import {
  ArrowLeft,
  BarChart,
  Clock,
  CheckCircle,
  Users,
  Star,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import courseService from "../services/Course";
import { toast } from "react-toastify";
import { ThemeDataContext } from "../context/ThemeContext";
import { useQuery } from "@tanstack/react-query";

const CoursePreview = () => {
  let { courseId } = useParams();
  let { darkMode } = useContext(ThemeDataContext);
  let navigate = useNavigate();
  let { instructorCourses } = useSelector((state) => state.course);
  const [courseStatus, setcourseStatus] = useState("");
  const [courseRating, setcourseRating] = useState(0);

  useEffect(() => {
    async function fetchCourse() {
      let res = await courseService.getSingleCourse(courseId);
      setcourseStatus(res?.data?.status);
    }
    fetchCourse();
  }, [courseId]);

  useQuery({
    queryKey: ["fetchCourseRating", courseId],
    queryFn: async function () {
      try {
        let ratingRes = await courseService.getCourseRating(courseId);
        if (ratingRes.status === 200) {
          setcourseRating(ratingRes.data);
        }
        return true;
      } catch (error) {
        console.log(error?.response?.data?.message);
        return false;
      }
    },
  });

  let specificCourse =
    Array.isArray(instructorCourses) &&
    instructorCourses.find((course) => course?._id === courseId);

  async function handlePublishCourse() {
    try {
      await courseService.changeCourseStatus(specificCourse?._id, "Published");
      setcourseStatus("Published");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div
        className={`shadow ${
          darkMode ? "bg-gray-800" : "bg-white"
        } transition-colors`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/dashboard/instructor")}
              className={`${
                darkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold">Course Preview</h1>
          </div>

          <button
            disabled={
              courseStatus === "Published" || specificCourse?.lessons?.length === 0
            }
            onClick={handlePublishCourse}
            className={`px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              courseStatus === "Published" || specificCourse?.lessons?.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : " bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            <CheckCircle className="h-5 w-5" />
            <span>{courseStatus === "Published" ? "Published" : "Publish Course"}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-2xl overflow-hidden">
            <img
              src={
                specificCourse?.thumbnail === ""
                  ? "https://cdn.pixabay.com/photo/2018/02/27/10/49/training-3185170_1280.jpg"
                  : specificCourse?.thumbnail
              }
              alt={specificCourse?.title}
              className="w-full h-[300px] sm:h-[400px] object-cover rounded-lg"
            />
          </div>

          <div className={`rounded-2xl p-6 shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h2 className="text-2xl font-bold mb-4">About This Course</h2>
            <p className="text-sm sm:text-base">{specificCourse?.description}</p>
          </div>

          {/* Course Content Section */}
          <div className={`rounded-2xl p-6 shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h2 className="text-2xl font-bold mb-6">Course Content</h2>
            <div className="space-y-4">
              {Array.isArray(specificCourse?.lessons) &&
                specificCourse?.lessons?.map((chapter, index) => (
                  <div
                    key={index}
                    className={`border rounded-xl p-4 transition-colors duration-200 ${
                      darkMode ? "border-gray-700 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                          Lesson {index + 1}
                        </span>
                        <h3 className="text-lg font-semibold">{chapter.title}</h3>
                      </div>
                      <span className="text-sm flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {chapter?.duration} min
                      </span>
                    </div>
                    {chapter.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{chapter.description}</p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className={`rounded-2xl p-6 shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="space-y-4">
              <InfoRow darkMode={darkMode} icon={Clock} label="Duration" value={`${specificCourse?.duration} weeks`} />
              <InfoRow darkMode={darkMode} icon={BarChart} label="Level" value={specificCourse?.level} />
              <InfoRow darkMode={darkMode} icon={Users} label="Students" value={specificCourse?.studentsEnrolled?.length} />
              <InfoRow darkMode={darkMode} icon={Star} label="Rating" value={Number(courseRating).toFixed(1)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component
const InfoRow = ({ darkMode, icon: Icon, label, value }) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-2">
      <Icon className={`h-5 w-5 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
      <span>{label}</span>
    </div>
    <span className="font-medium">{value}</span>
  </div>
);

export default CoursePreview;
