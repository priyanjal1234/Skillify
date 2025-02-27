import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ThemeDataContext } from "../context/ThemeContext";
import FormFieldWithoutIcon from "../components/FormFieldWithoutIcon";
import courseService from "../services/Course";
import { toast } from "react-toastify";

const EditCourse = () => {
  let { courseId } = useParams();
  const { darkMode } = useContext(ThemeDataContext);
  const [edit, setedit] = useState({
    title: "",
    description: "",
    category: "",
    level: "Beginner",
    price: "",
  });
  const [thumbnail, setthumbnail] = useState();
  const [loading, setloading] = useState(false);

  let navigate = useNavigate();

  const containerStyles = {
    backgroundColor: darkMode ? "#1F2937" : "#ffffff",
    color: darkMode ? "#F3F4F6" : "#1F2937",
  };

  const inputStyles = {
    backgroundColor: darkMode ? "#374151" : "#F9FAFB",
    borderColor: darkMode ? "#4B5563" : "#D1D5DB",
    color: darkMode ? "#E5E7EB" : "#1F2937",
  };

  function handleEditCourseChange(e) {
    let { name, value } = e.target;

    setedit((prev) => ({ ...prev, [name]: value }));
  }

  async function handleEditCourse(e) {
    e.preventDefault();

    setloading(true);

    let formData = new FormData();

    if (edit.title) formData.append("title", edit.title);
    if (edit.description) formData.append("description", edit.description);
    if (edit.category) formData.append("category", edit.category);
    if (edit.level) formData.append("level", edit.level);
    if (edit.price) formData.append("price", edit.price);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    try {
      let editCourseRes = await courseService.updateCourse(courseId, formData);
      await courseService.changeCourseStatus(courseId, "Draft");
      setloading(false);
      toast.success("Course Updated Successfully");
      navigate("/dashboard/instructor");
    } catch (error) {
      setloading(false);
      toast.error(error?.response?.data?.message || "Failed to update course");
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        className="rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
        style={containerStyles}
      >
        <h2 className="text-2xl font-semibold mb-4">Edit Course</h2>
        <form onSubmit={handleEditCourse} className="space-y-6">
          <FormFieldWithoutIcon
            label="Course Title"
            type="text"
            placeholder="Update Course Title"
            name="title"
            value={edit.title}
            handleChange={handleEditCourseChange}
            inputStyles={inputStyles}
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Update Course Description"
              rows={4}
              className="w-full px-4 py-2 resize-none border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              style={inputStyles}
              value={edit.description}
              onChange={handleEditCourseChange}
            />
          </div>

          {/* Category & Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormFieldWithoutIcon
              label="Category"
              type="text"
              placeholder="e.g., Programming"
              name="category"
              value={edit.category}
              handleChange={handleEditCourseChange}
              inputStyles={inputStyles}
            />

            <div>
              <label className="block text-sm font-medium mb-1">Level</label>
              <select
                name="level"
                className="w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                style={inputStyles}
                onChange={handleEditCourseChange}
                value={edit.level}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Price Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                ₹
              </span>
              <input
                type="number"
                name="price"
                placeholder="Update Price"
                className="w-full pl-8 pr-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                style={inputStyles}
                onChange={handleEditCourseChange}
                value={edit.price}
              />
            </div>
          </div>

          {/* Course Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Course Thumbnail
            </label>
            <div className="flex items-center">
              <input
                id="thumbnail-upload"
                type="file"
                name="thumbnail"
                accept="image/*"
                className="hidden"
                onChange={(e) => setthumbnail(e.target.files[0])}
              />
              <label
                htmlFor="thumbnail-upload"
                className="cursor-pointer px-4 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Upload Thumbnail
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => navigate("/dashboard/instructor")}
              type="button"
              className="px-4 py-2 border rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100"
              style={{
                backgroundColor: darkMode ? "#374151" : "#E5E7EB",
                color: darkMode ? "#F3F4F6" : "#1F2937",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg flex gap-3 items-center justify-center text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Update Course
              {loading && <span className="loader"></span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;
