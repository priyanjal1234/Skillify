import { ArrowLeft, CheckCircle, Clock, PlayCircle } from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
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
  const [thumbnails, setThumbnails] = useState({});
  const [selectedLecture, setselectedLecture] = useState(null);

  const [progress, setprogress] = useState(0);

  const [showModal, setshowModal] = useState(false);

  const [activeQuizLessonId, setActiveQuizLessonId] = useState(null);

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

  let { refetch: refetchProgress } = useQuery({
    queryKey: ["fetchCourseProgress"],
    queryFn: async function () {
      try {
        let progressRes = await userService.getUserProgress(
          courseId,
          selectedLecture?._id
        );

        setprogress(progressRes.data);
        return progressRes.data;
      } catch (error) {
        console.log(error?.response?.data?.message);

        return false;
      }
    },
  });

  useEffect(() => {
    if (course && course.lessons && course.lessons.length > 0) {
      course.lessons.forEach((lesson) => {
        // Skip if we already have a thumbnail for this lesson
        if (thumbnails[lesson._id] || !lesson.videoUrl) return;

        const videoElement = document.createElement("video");
        videoElement.src = lesson.videoUrl;
        videoElement.crossOrigin = "anonymous";

        videoElement.addEventListener("loadedmetadata", () => {
          // Set currentTime to 1 second (or adjust as needed)
          videoElement.currentTime = 1;
        });

        videoElement.addEventListener("seeked", () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          // Define desired thumbnail dimensions for the list
          const thumbnailWidth = 120;
          const thumbnailHeight = 90;
          canvas.width = thumbnailWidth;
          canvas.height = thumbnailHeight;
          ctx.drawImage(videoElement, 0, 0, thumbnailWidth, thumbnailHeight);
          const thumbnailUrl = canvas.toDataURL("image/jpeg");
          setThumbnails((prev) => ({ ...prev, [lesson._id]: thumbnailUrl }));
        });
      });
    }
  }, [course, thumbnails]);

  function handleSelectedLecture(lessonId) {
    let lesson = course?.lessons?.find((l) => l?._id === lessonId);
    if (lesson) {
      setselectedLecture(lesson);
    }
  }

  let { data: completedLessons, refetch: refetchCompletedLessons } = useQuery({
    queryKey: ["getCompletedLessons"],
    queryFn: async function () {
      try {
        let response = await userService.getCompletedLessons();
        return response.data;
      } catch (error) {
        console.log(error?.response?.data?.message);
        return [];
      }
    },
  });

  async function handleEndVideo() {
    try {
      await userService.setCompleteLesson(selectedLecture?._id);
      refetchCompletedLessons();
      refetchProgress();
      let getQuizRes = await quizService.getQuiz(selectedLecture?._id);

      if (getQuizRes.status === 200) {
        setActiveQuizLessonId(selectedLecture?._id);
        setshowModal(true);
        dispatch(setCurrentQuiz(getQuizRes.data));
      }
    } catch (error) {
      if (error?.response?.data?.message === "Quiz not found for this lesson") {
        return;
      } else {
        toast.error(error?.response?.data?.message);
      }
    }
  }

  function handleTakeQuiz(lessonId) {
    navigate(`/quiz/${courseId}/${lessonId}`);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center space-x-3">
          <Link to={`/course/${courseId}`}>
            <ArrowLeft className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </Link>
          <h1 className="text-xl font-bold">Classroom</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video/Content Display */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl overflow-hidden shadow-lg">
            {selectedLecture ? (
              <div className="relative">
                <div>
                  {/* If a video URL exists, render the video player */}
                  {selectedLecture.videoUrl ? (
                    <>
                      <ReactPlayer
                        url={selectedLecture?.videoUrl}
                        controls
                        width="100%"
                        height="500px"
                        style={{ objectFit: "cover" }}
                        onEnded={handleEndVideo}
                      />
                      <div className="p-2">
                        <button onClick={() => navigate("/do-code")} className="w-full mt-2 h-[40px] bg-blue-600 rounded-lg text-sm font-semibold">
                          Code Yourself
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-[500px] flex items-center justify-center bg-gray-300 dark:bg-gray-700">
                      <PlayCircle className="h-20 w-20 text-gray-600 dark:text-gray-300" />
                    </div>
                  )}
                  {/* Overlay title on the video */}
                </div>
              </div>
            ) : (
              <div className="w-full h-[500px] flex items-center justify-center">
                <p>No lecture selected</p>
              </div>
            )}
          </div>

          {/* Lecture Description */}
          {selectedLecture && selectedLecture.description && (
            <div
              className={`p-6 rounded-2xl shadow-sm ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">
                {selectedLecture.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {selectedLecture.description}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar: Lectures List */}
        <div className="space-y-6">
          <div className="mb-4">
            <div className="text-sm font-semibold mb-1">Course Progress</div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-right text-lg mt-1">
              {Number(progress).toFixed(2)}%
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Lectures</h2>
          <div className="space-y-2 overflow-auto">
            {course?.lessons?.map((lesson, index) => (
              <>
                <div
                  onClick={() => handleSelectedLecture(lesson?._id)}
                  key={index}
                  className={`cursor-pointer relative ${
                    showModal && "pb-4"
                  } overflow-hidden border rounded-xl transition-colors duration-200 ${
                    darkMode
                      ? "border-gray-700 hover:bg-gray-700"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center p-2">
                    {/* Fixed-size thumbnail container */}
                    <div className="w-[120px] h-[90px] overflow-hidden flex-shrink-0 mr-4">
                      {/* Force the image to fill this container */}
                      <img
                        src={thumbnails[lesson?._id]}
                        alt=""
                        className="object-cover w-full h-full"
                      />
                    </div>

                    {/* Lecture text */}
                    <div className="flex-1">
                      <span className="text-sm font-semibold">
                        Lecture {index + 1}
                      </span>
                      <h3 className="text-lg font-semibold">{lesson?.title}</h3>
                    </div>
                    {completedLessons?.includes(lesson?._id) && (
                      <CheckCircle color="green" />
                    )}
                  </div>
                  {showModal && activeQuizLessonId === lesson?._id && (
                    <QuizModal
                      showModal={showModal}
                      setShowModal={setshowModal}
                      handleTakeQuiz={handleTakeQuiz}
                    />
                  )}
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassRoom;
