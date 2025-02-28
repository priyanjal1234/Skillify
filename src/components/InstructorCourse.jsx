import { Edit3, Eye, Plus, Search, Trash2 } from "lucide-react";
import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { ThemeDataContext } from "../context/ThemeContext";
import getStatusIcon from "../utils/getStatusIcon";
import getStatusColor from "../utils/getStatusColor";
import AddCourse from "./AddCourse";
import { Link, useNavigate } from "react-router-dom";
import courseService from "../services/Course";
import { toast } from "react-toastify";

const InstructorCourse = ({ refetch }) => {
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [errors, seterrors] = useState({});
  let { darkMode } = useContext(ThemeDataContext);
  let { instructorCourses } = useSelector((state) => state.course);

  const [addCourseData, setaddCourseData] = useState({
    title: "",
    description: "",
    category: "",
    level: "Beginner",
    price: "",
    duration: "",
    courseOutcome: []
  });
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

  return (
    <div>
      <div className="w-full flex items-center  justify-between">
        <h1 className="text-3xl font-semibold">Courses</h1>
        <button
          onClick={() => setShowAddCourse(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Course</span>
        </button>
      </div>

      <div
        className={`mt-8 rounded-xl shadow-sm overflow-hidden ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Search Bar */}
        <div
          className={`p-6 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center">
            <div className="relative flex-1">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                  darkMode ? "text-gray-300" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder="Search courses..."
                className={`w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                ${
                  darkMode
                    ? "border-gray-600 bg-gray-700 text-white"
                    : "border-gray-200 bg-gray-50 text-gray-900"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        {Array.isArray(instructorCourses) && instructorCourses.length !== 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead
                className={
                  darkMode
                    ? "bg-gray-700/50 text-white"
                    : "bg-gray-50 text-gray-900"
                }
              >
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className={
                  darkMode
                    ? "divide-y divide-gray-700 text-white"
                    : "divide-y divide-gray-200 text-gray-900"
                }
              >
                {instructorCourses?.map((course) => (
                  <tr
                    key={course?._id}
                    className={
                      darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={
                            course?.thumbnail === ""
                              ? "https://cdn.pixabay.com/photo/2018/02/27/10/49/training-3185170_1280.jpg"
                              : course?.thumbnail
                          }
                          className="h-10 w-16 object-cover rounded"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium">
                            {course?.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          course?.status
                        )}`}
                      >
                        {getStatusIcon(course?.status)}
                        <span className="ml-1 capitalize">
                          {course?.status}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {course?.studentsEnrolled?.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {course?.rating?.totalRatings}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(course?.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          disabled={course?.status === "Published"}
                          onClick={() => handleGotoPreview(course?._id)}
                          className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <Link
                          to={`/edit-course/${course?._id}`}
                          className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        >
                          <Edit3 className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteCourse(course?._id)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">No Courses To Display</div>
        )}
      </div>

      {showAddCourse && (
        <AddCourse
          addCourseData={addCourseData}
          setaddCourseData={setaddCourseData}
          errors={errors}
          seterrors={seterrors}
          setShowAddCourse={setShowAddCourse}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default InstructorCourse;
