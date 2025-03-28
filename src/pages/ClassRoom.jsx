import { ArrowLeft, CheckCircle, PlayCircle, Menu } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { ThemeDataContext } from "../context/ThemeContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import courseService from "../services/Course";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";
import userService from "../services/User";
import quizService from "../services/Quiz";
import QuizModal from "../components/QuizModal";
import { useDispatch } from "react-redux";
import { setCurrentQuiz } from "../redux/reducers/QuizReducer";

const ClassRoom = () => {
  let { courseId } = useParams();
  let { darkMode } = useContext(ThemeDataContext);
  const [course, setCourse] = useState(null);
  const [selectedLecture, setselectedLecture] = useState(null);
  const [progress, setprogress] = useState(0);
  const [showModal, setshowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar toggle state

  let navigate = useNavigate();
  let dispatch = useDispatch();

  useEffect(() => {
    localStorage.removeItem("quizCompleted");
  }, []);

  useQuery({
    queryKey: ["getSingleCourse"],
    queryFn: async function () {
      try {
        let getSingleCourseRes = await courseService.getSingleCourse(courseId);
        setCourse(getSingleCourseRes.data);
        return getSingleCourseRes.data;
      } catch (error) {
        console.log(error?.response?.data?.message);
        return {};
      }
    },
  });

  function handleSelectedLecture(lessonId) {
    let lesson = course?.lessons?.find((l) => l?._id === lessonId);
    if (lesson) {
      setselectedLecture(lesson);
    }
    setSidebarOpen(false); // Close sidebar on mobile when a lesson is selected
  }

  async function handleEndVideo() {
    try {
      await userService.setCompleteLesson(selectedLecture?._id);
      let getQuizRes = await quizService.getQuiz(selectedLecture?._id);

      if (getQuizRes.status === 200) {
        setshowModal(true);
        dispatch(setCurrentQuiz(getQuizRes.data));
      }
    } catch (error) {
      if (error?.response?.data?.message !== "Quiz not found for this lesson") {
        toast.error(error?.response?.data?.message);
      }
    }
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div className={`shadow ${darkMode ? "bg-gray-800" : "bg-white"} transition-colors`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to={`/course/${courseId}`}>
              <ArrowLeft className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </Link>
            <h1 className="text-xl font-bold">Classroom</h1>
          </div>
          {/* Sidebar Toggle Button (Visible on Mobile) */}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
            <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Content Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl overflow-hidden shadow-lg">
            {selectedLecture ? (
              <div className="relative">
                {selectedLecture.videoUrl ? (
                  <ReactPlayer
                    url={selectedLecture?.videoUrl}
                    controls
                    width="100%"
                    height="auto"
                    className="aspect-video"
                    onEnded={handleEndVideo}
                  />
                ) : (
                  <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] flex items-center justify-center bg-gray-300 dark:bg-gray-700">
                    <PlayCircle className="h-20 w-20 text-gray-600 dark:text-gray-300" />
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] flex items-center justify-center">
                <p>No lecture selected</p>
              </div>
            )}
          </div>

          {/* Lecture Description */}
          {selectedLecture && selectedLecture.description && (
            <div className={`p-6 rounded-2xl shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <h3 className="text-2xl font-bold mb-2">{selectedLecture.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{selectedLecture.description}</p>
            </div>
          )}
        </div>

        {/* Sidebar (Lectures List) */}
        <div
          className={`fixed inset-0 z-50 bg-gray-900 bg-opacity-50 lg:bg-transparent lg:static lg:z-auto transition-transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          } lg:w-auto w-3/4 max-w-xs lg:max-w-none lg:block`}
        >
          <div className="bg-white dark:bg-gray-900 h-full lg:h-auto p-6 shadow-lg lg:shadow-none rounded-r-xl">
            <div className="flex justify-between items-center mb-4 lg:hidden">
              <h2 className="text-xl font-bold">Lectures</h2>
              <button onClick={() => setSidebarOpen(false)}>✕</button>
            </div>

            {/* Course Progress */}
            <div className="mb-4">
              <div className="text-sm font-semibold mb-1">Course Progress</div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-right text-lg mt-1">{Number(progress).toFixed(2)}%</div>
            </div>

            {/* Lecture List */}
            <div className="space-y-2">
              {course?.lessons?.map((lesson, index) => (
                <div
                  key={lesson._id}
                  onClick={() => handleSelectedLecture(lesson._id)}
                  className="cursor-pointer p-4 rounded-xl shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <h3 className="text-lg font-semibold">Lecture {index + 1}</h3>
                  <p className="text-sm text-gray-500">{lesson.title}</p>
                  {completedLessons?.includes(lesson._id) && <CheckCircle color="green" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassRoom;
