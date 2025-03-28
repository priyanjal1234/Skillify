import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Upload, Video, Clock } from "lucide-react";
import { ThemeDataContext } from "../context/ThemeContext";
import AddLessonResource from "../components/AddLessonResource";
import AddLessonQuiz from "../components/AddLessonQuiz";
import AddLessonPreviewSidebar from "../components/AddLessonPreviewSidebar";
import truncateText from "../utils/truncateText";
import lessonService from "../services/Lesson";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const EditLesson = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeDataContext);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [lessonData, setLessonData] = useState({
    title: "",
    content: "",
    duration: "",
  });
  const [existingLesson, setExistingLesson] = useState({});
  let { instructorCourses } = useSelector((state) => state.course);

  const [previewTitle, setPreviewTitle] = useState("No Title Yet");
  const [previewDescription, setPreviewDescription] =
    useState("No Description Yet");
  const [previewDuration, setPreviewDuration] = useState("No Duration Yet");
  const [thumbnail, setThumbnail] = useState(null);
  const [lessonVideo, setLessonVideo] = useState(null);

  useEffect(() => {
    async function fetchLesson() {
      try {
        let getOneLessonRes = await lessonService.getOneLesson(lessonId);
        setExistingLesson(getOneLessonRes.data);
      } catch (error) {
        console.log(error?.response?.data?.message);
      }
    }
    fetchLesson();
  }, [courseId, lessonId]);

  useEffect(() => {
    setLessonData((prev) => ({
      ...prev,
      title: existingLesson?.title || "",
      content: existingLesson?.content || "",
      duration: existingLesson?.duration || "",
    }));
  }, [existingLesson]);

  function handleEditLessonChange(e) {
    const { name, value } = e.target;
    setLessonData((prev) => ({ ...prev, [name]: value }));

    if (name === "title") {
      setPreviewTitle(value === "" ? "No Title Yet" : value);
    }
    if (name === "content") {
      setPreviewDescription(
        value === "" ? "No Description Yet" : truncateText(value, 30)
      );
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

      canvas.width = 400;
      canvas.height = 300;

      ctx.drawImage(videoElement, 0, 0, 400, 300);
      setThumbnail(canvas.toDataURL("image/jpeg"));
    };
  }

  async function handleUpdateLesson() {
    let formdata = new FormData();
    formdata.append("title", lessonData.title);
    formdata.append("content", lessonData.content);
    formdata.append("duration", lessonData.duration);
    if (lessonVideo) {
      formdata.append("lessonVideo", lessonVideo);
    }
    try {
      await lessonService.updateLesson(lessonId, formdata);
      toast.success("Lesson Updated Successfully");
      navigate(`/lessons/${courseId}`);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <div className={`${darkMode ? "bg-gray-900" : "bg-gray-50"} min-h-screen`}>
      {/* Header */}
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} shadow sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to={`/lessons/${courseId}`} className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Edit Lesson</h1>
            </div>
            <button
              onClick={handleUpdateLesson}
              className="px-6 py-2 rounded-lg text-white font-medium flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700"
            >
              <Save className="h-5 w-5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Lesson Information</h2>
              <div className="space-y-4">
                {/* Title */}
                <input
                  type="text"
                  name="title"
                  value={lessonData.title}
                  onChange={handleEditLessonChange}
                  placeholder="Enter lesson title"
                  className="w-full px-4 py-2 border rounded-lg"
                />
                {/* Content */}
                <textarea
                  name="content"
                  value={lessonData.content}
                  rows={4}
                  placeholder="Describe what students will learn"
                  className="w-full px-4 py-2 border rounded-lg"
                />
                {/* Duration */}
                <input
                  type="number"
                  name="duration"
                  value={lessonData.duration}
                  placeholder="Duration in minutes"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Resources Section */}
            <AddLessonResource />

            {/* Quiz Section */}
            <AddLessonQuiz lessonId={lessonId} />
          </div>

          {/* Sidebar Preview - Hidden on Mobile */}
          <div className="hidden lg:block">
            <AddLessonPreviewSidebar previewTitle={previewTitle} previewDescription={previewDescription} previewDuration={previewDuration} thumbnail={thumbnail} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditLesson;
