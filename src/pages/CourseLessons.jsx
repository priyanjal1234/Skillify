import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import lessonService from "../services/Lesson";
import { ArrowLeft, Edit, Plus, PlusCircle, Trash2 } from "lucide-react";
import { ThemeDataContext } from "../context/ThemeContext";
import { useSelector } from "react-redux";
import courseService from "../services/Course";
import { toast } from "react-toastify";

const CourseLessons = () => {
  let { courseId } = useParams();
  const [lessons, setlessons] = useState([]);
  let { darkMode } = useContext(ThemeDataContext);
  const [course, setcourse] = useState({});
  let navigate = useNavigate();

  let { instructorCourses } = useSelector((state) => state.course);

  useEffect(() => {
    let foundCourse = instructorCourses.find((c) => c?._id === courseId);
    if (foundCourse) {
      setcourse(foundCourse);
    }
  }, [courseId]);

  let { refetch } = useQuery({
    queryKey: ["fetchCourseLessons"],
    queryFn: async function () {
      try {
        let getCourseLessonsRes = await lessonService.getCourseLessons(
          courseId
        );
        if (getCourseLessonsRes.status === 200) {
          setlessons(getCourseLessonsRes.data);
        }

        return getCourseLessonsRes.data;
      } catch (error) {
        console.log(error?.response?.data?.message);
        return [];
      }
    },
  });

  async function handleEditLesson(lessonId) {
    try {
      await courseService.changeCourseStatus(courseId, "Review");
      navigate(`/edit-lesson/${courseId}/${lessonId}`);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  async function handleDeleteLesson(lessonId, courseId) {
    try {
      await lessonService.deleteLesson(lessonId, courseId);
      await courseService.changeCourseStatus(courseId, "Review");
      toast.success("Lesson Deleted Successfully");
      refetch();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  async function handleChangeStatusOnAddingCourse() {
    try {
      await courseService.changeCourseStatus(courseId, "Review");
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              to="/dashboard/instructor"
              className={`${
                darkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-xl font-bold">Lessons for {course?.title} </h1>
          </div>

          <Link
            onClick={handleChangeStatusOnAddingCourse}
            to={`/add-lesson/${courseId}`}
            className="px-4 py-2 rounded-lg flex gap-3 items-center justify-center text-white bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-5 w-5" />
            Add Lesson
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {lessons && lessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson, index) => (
              <div
                key={lesson._id}
                className={`p-4 border rounded-xl transition-colors duration-200 ${
                  darkMode
                    ? "border-gray-700 hover:bg-gray-700"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <h2 className="text-lg font-semibold">
                  {index + 1}. {lesson.title}
                </h2>

                {lesson.duration && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Duration: {lesson.duration} minutes
                  </p>
                )}

                {lesson.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-3">
                    {lesson.description}
                  </p>
                )}

                <div className="flex items-center space-x-4 mt-4">
                  <button
                    onClick={() => handleEditLesson(lesson?._id)}
                    className={`text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200`}
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteLesson(lesson?._id, lesson?.course)
                    }
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            No lessons found. Click <strong>Add Lesson</strong> to create one.
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseLessons;
