import React, { useContext, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Upload,
  Video,
  Clock,
} from "lucide-react";
import { ThemeDataContext } from "../context/ThemeContext";
import AddLessonPreviewSidebar from "../components/AddLessonPreviewSidebar";
import truncateText from "../utils/truncateText";
import lessonService from "../services/Lesson";
import { toast } from "react-toastify";
import courseService from "../services/Course";

const AddLesson = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeDataContext);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [previewTitle, setPreviewTitle] = useState("No Title Yet");
  const [previewDescription, setPreviewDescription] =
    useState("No Description Yet");
  const [previewDuration, setPreviewDuration] = useState("No Duration Yet");

  const [lessonData, setLessonData] = useState({
    title: "",
    content: "",
    duration: "",
  });
  const [lessonVideo, setLessonVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleAddLessonChange(e) {
    const { name, value } = e.target;
    setLessonData((prev) => ({ ...prev, [name]: value }));

    if (name === "title") {
      setPreviewTitle(value === "" ? "No Title Yet" : value);
    }
    if (name === "content") {
      setPreviewDescription(value === "" ? "No Description Yet" : truncateText(value, 30));
    }
    if (name === "duration") {
      setPreviewDuration(value === "" ? "No Duration Yet" : `${value} minutes`);
    }
  }

  function handleLessonVideoChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "video/mp4" && file.type !== "video/webm") {
      alert("Please upload a valid video file (MP4 or WebM).");
      return;
    }

    setLessonVideo(file);
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
      setThumbnail(canvas.toDataURL("image/jpeg"));
    };
  }

  async function handleSaveLesson() {
    setLoading(true);
    let formdata = new FormData();
    formdata.append("title", lessonData.title);
    formdata.append("content", lessonData.content);
    formdata.append("duration", lessonData.duration);
    formdata.append("lessonVideo", lessonVideo);

    try {
      await lessonService.createLesson(formdata, courseId);
      await courseService.changeCourseStatus(courseId, "Draft");
      toast.success("Lesson Created Successfully");
      setLoading(false);
      navigate(`/dashboard/instructor`);
      setLessonData({ title: "", content: "", duration: "" });
      setLessonVideo(null);
    } catch (error) {
      setLoading(false);
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
                className={`${darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
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

      {/* Responsive Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-sm p-6`}>
              <h2 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                Lesson Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={lessonData.title}
                    onChange={handleAddLessonChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Content
                  </label>
                  <textarea
                    name="content"
                    value={lessonData.content}
                    onChange={handleAddLessonChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Upload Video</label>
                  <input
                    id="lessonVideo"
                    type="file"
                    onChange={handleLessonVideoChange}
                    ref={videoRef}
                    className="w-full"
                    accept="video/*"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    value={lessonData.duration}
                    onChange={handleAddLessonChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Preview */}
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
