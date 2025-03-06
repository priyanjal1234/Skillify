import React, { useContext, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Upload,
  Video,
  FileText,
  Link as LinkIcon,
  Clock,
  CheckSquare,
} from "lucide-react";
import { ThemeDataContext } from "../context/ThemeContext";
import AddLessonResource from "../components/AddLessonResource";
import AddLessonQuiz from "../components/AddLessonQuiz";
import AddLessonPreviewSidebar from "../components/AddLessonPreviewSidebar";
import truncateText from "../utils/truncateText";
import lessonService from "../services/Lesson";
import { toast } from "react-toastify";

const AddLesson = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeDataContext);

  let videoRef = useRef(null);

  const [previewTitle, setpreviewTitle] = useState("No Title Yet");
  const [previewDescription, setpreviewDescription] =
    useState("No Description Yet");
  const [previewDuration, setpreviewDuration] = useState("No Duration Yet");

  const [lessonData, setlessonData] = useState({
    title: "",
    content: "",
    duration: "",
  });
  const [lessonVideo, setlessonVideo] = useState(null);
  const [thumbnail, setthumbnail] = useState(null);
  const [loading, setloading] = useState(false);
  let canvasRef = useRef(null);

  function handleAddLessonChange(e) {
    let { name, value } = e.target;
    setlessonData((prev) => ({ ...prev, [name]: value }));

    if (name === "title") {
      setpreviewTitle(value === "" ? "No Title Yet" : value);
    }
    if (name === "content") {
      setpreviewDescription(
        value === "" ? "No Description Yet" : truncateText(value, 30)
      );
    }
    if (name === "duration") {
      setpreviewDuration(value === "" ? "No Duration Yet" : `${value} minutes`);
    }
  }

  function handleLessonVideoChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "video/mp4" && file.type !== "video/webm") {
      alert("Please upload a valid video file (MP4 or WebM).");
      return;
    }

    setlessonVideo(file);

    const videoUrl = URL.createObjectURL(file);

    const videoElement = document.createElement("video");
    videoElement.src = videoUrl;

    videoElement.onloadedmetadata = () => {
      videoElement.currentTime = 1;
    };

    videoElement.onseeked = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const thumbnailWidth = 400;
      const thumbnailHeight = 300;

      canvas.width = thumbnailWidth;
      canvas.height = thumbnailHeight;

      ctx.drawImage(videoElement, 0, 0, thumbnailWidth, thumbnailHeight);
      const thumbnailUrl = canvas.toDataURL("image/jpeg");
      setthumbnail(thumbnailUrl);
    };
  }

  async function handleSaveLesson() {
    setloading(true);
    let formdata = new FormData();
    formdata.append("title", lessonData.title);
    formdata.append("content", lessonData.content);
    formdata.append("duration", lessonData.duration);
    formdata.append("lessonVideo", lessonVideo);

    try {
      await lessonService.createLesson(formdata, courseId);
      toast.success("Lesson Created Successfully");
      setloading(false);
      navigate(`/dashboard/instructor`)
      setlessonData((prev) => ({
        ...prev,
        title: "",
        content: "",
        duration: "",
      }));
      setlessonVideo(null);
    } catch (error) {
      setloading(false)
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <div className={`${darkMode ? "bg-gray-900" : "bg-gray-50"} min-h-screen`}>
      {/* Header */}
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} shadow`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link
                to={`/lessons/${courseId}`}
                className={`${
                  darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Add New Lesson
              </h1>
            </div>
            <button
              onClick={handleSaveLesson}
              className="px-6 py-2 rounded-lg text-white font-medium flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700"
            >
              <Save className="h-5 w-5" />
              <span>Create Lesson</span>
              {loading && <span className="loader"></span>}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-xl shadow-sm p-6`}
            >
              <h2
                className={`text-lg font-semibold mb-4 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Lesson Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className={`block text-sm font-medium mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={lessonData.title}
                    onChange={handleAddLessonChange}
                    placeholder="Enter lesson title"
                    className={`w-full px-4 py-2 border-2 ${
                      darkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-gray-50 text-gray-900 border-gray-200"
                    } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                </div>
                <div>
                  <label
                    htmlFor="content"
                    className={`block text-sm font-medium mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Content
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={lessonData.content}
                    onChange={handleAddLessonChange}
                    rows={4}
                    placeholder="Describe what students will learn in this lesson"
                    className={`w-full px-4 py-2 border-2 ${
                      darkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-gray-50 text-gray-900 border-gray-200"
                    } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                </div>
                <div>
                  <label
                    htmlFor="videoUrl"
                    className={`block text-sm font-medium mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Video URL
                  </label>
                  <div className="flex">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Video className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="url"
                        id="videoUrl"
                        name="videoUrl"
                        placeholder="https://example.com/video"
                        className={`pl-10 w-full px-4 py-2 border-2 ${
                          darkMode
                            ? "bg-gray-700 text-white border-gray-600"
                            : "bg-gray-50 text-gray-900 border-gray-200"
                        } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      />
                    </div>
                    <input
                      id="lessonVideo"
                      name="lessonVideo"
                      onChange={handleLessonVideoChange}
                      ref={videoRef}
                      type="file"
                      className="hidden"
                      accept="video/*"
                    />

                    <button
                      onClick={() => videoRef.current.click()}
                      type="button"
                      className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      <Upload className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="duration"
                    className={`block text-sm font-medium mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Duration (minutes)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      value={lessonData.duration}
                      onChange={handleAddLessonChange}
                      placeholder="15"
                      min="1"
                      className={`pl-10 w-full px-4 py-2 border-2 ${
                        darkMode
                          ? "bg-gray-700 text-white border-gray-600"
                          : "bg-gray-50 text-gray-900 border-gray-200"
                      } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    />
                  </div>
                </div>
              </div>

              {/* Hidden Canvas */}
              <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            </div>

            
          </div>

          {/* Sidebar */}
          <AddLessonPreviewSidebar
            previewTitle={previewTitle}
            previewDescription={previewDescription}
            previewDuration={previewDuration}
            thumbnail={thumbnail}
          />
        </div>
      </div>
    </div>
  );
};

export default AddLesson;
