import { Edit3, Eye, Plus, Trash2 } from "lucide-react";
import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { ThemeDataContext } from "../context/ThemeContext";
import getStatusIcon from "../utils/getStatusIcon";
import getStatusColor from "../utils/getStatusColor";
import AddCourse from "./AddCourse";
import { Link, useNavigate } from "react-router-dom";
import courseService from "../services/Course";
import { toast } from "react-toastify";
import CourseRating from "./CourseRating";

const InstructorCourse = ({ refetch }) => {
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [errors, setErrors] = useState({});
  let { darkMode } = useContext(ThemeDataContext);
  let { instructorCourses } = useSelector((state) => state.course);
  let navigate = useNavigate();

  async function handleGotoPreview(courseId) {
    try {
      await courseService.changeCourseStatus(courseId, "Review");
      navigate(`/course-preview/${courseId}`);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  async function handleDeleteCourse(courseId) {
    try {
      await courseService.deleteCourse(courseId);
      toast.success("Course Deleted Successfully");
      refetch();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  function handleSeeLessons(courseId) {
    navigate(`/lessons/${courseId}`);
  }

  return (
    <div className="w-full px-4 md:px-8 lg:px-12">
      {/* Header Section */}
      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-semibold">Courses</h1>
        <button
          onClick={() => setShowAddCourse(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm md:text-base"
        >
          <Plus className="h-4 w-4 md:h-5 md:w-5" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Courses Table */}
      <div
        className={`mt-6 overflow-x-auto rounded-lg shadow-sm ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {Array.isArray(instructorCourses) && instructorCourses.length !== 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] md:min-w-full">
              <thead
                className={`${
                  darkMode
                    ? "bg-gray-700/50 text-white"
                    : "bg-gray-50 text-gray-900"
                }`}
              >
                <tr className="text-xs md:text-sm">
                  <th className="px-4 md:px-6 py-3 text-left uppercase">Course</th>
                  <th className="px-4 md:px-6 py-3 text-left uppercase">Status</th>
                  <th className="px-4 md:px-6 py-3 text-left uppercase">Students</th>
                  <th className="px-4 md:px-6 py-3 text-left uppercase">Rating</th>
                  <th className="px-4 md:px-6 py-3 text-left uppercase">Updated</th>
                  <th className="px-4 md:px-6 py-3 text-right uppercase">Actions</th>
                </tr>
              </thead>
              <tbody
                className={`${
                  darkMode
                    ? "divide-y divide-gray-700 text-white"
                    : "divide-y divide-gray-200 text-gray-900"
                }`}
              >
                {instructorCourses.map((course) => (
                  <tr
                    key={course?._id}
                    className={`${
                      darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                    }`}
                  >
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap flex items-center">
                      <img
                        src={
                          course?.thumbnail ||
                          "https://cdn.pixabay.com/photo/2018/02/27/10/49/training-3185170_1280.jpg"
                        }
                        className="h-8 w-12 md:h-10 md:w-16 object-cover rounded"
                        alt={course?.title}
                      />
                      <div
                        onClick={() => handleSeeLessons(course?._id)}
                        className="ml-2 md:ml-4 text-sm font-medium cursor-pointer hover:underline"
                      >
                        {course?.title}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          course?.status
                        )}`}
                      >
                        {getStatusIcon(course?.status)}
                        <span className="ml-1 capitalize">{course?.status}</span>
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-center">
                      {course?.studentsEnrolled?.length}
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                      <CourseRating courseId={course?._id} />
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(course?.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          disabled={course?.status === "Published"}
                          onClick={() => handleGotoPreview(course?._id)}
                          className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        >
                          <Eye className="h-4 w-4 md:h-5 md:w-5" />
                        </button>
                        <Link
                          to={`/edit-course/${course?._id}`}
                          className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        >
                          <Edit3 className="h-4 w-4 md:h-5 md:w-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteCourse(course?._id)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center">No Courses To Display</div>
        )}
      </div>

      {showAddCourse && (
        <AddCourse
          setShowAddCourse={setShowAddCourse}
          refetch={refetch}
          errors={errors}
          setErrors={setErrors}
        />
      )}
    </div>
  );
};

export default InstructorCourse;
