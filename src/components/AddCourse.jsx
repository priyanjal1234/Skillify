import React, { useContext, useState } from "react";
import FormFieldWithoutIcon from "./FormFieldWithoutIcon";
import { ThemeDataContext } from "../context/ThemeContext";
import courseSchema from "../schemas/courseSchema";
import { toast } from "react-toastify";
import courseService from "../services/Course";
import { Editor, EditorState, convertToRaw } from "draft-js";
import "draft-js/dist/Draft.css";

const AddCourse = ({
  addCourseData,
  setaddCourseData,
  errors,
  seterrors,
  setShowAddCourse,
  refetch,
}) => {
  const { darkMode } = useContext(ThemeDataContext);
  const [loading, setLoading] = useState(false);
  const [courseOutcomeList, setcourseOutcomeList] = useState([]);

  const containerStyles = {
    backgroundColor: darkMode ? "#1F2937" : "#ffffff",
    color: darkMode ? "#F3F4F6" : "#1F2937",
  };

  const inputStyles = {
    backgroundColor: darkMode ? "#374151" : "#F9FAFB",
    borderColor: darkMode ? "#4B5563" : "#D1D5DB",
    color: darkMode ? "#E5E7EB" : "#1F2937",
  };

  const [thumbnail, setthumbnail] = useState();

  function handleAddCourseChange(e) {
    let { name, value } = e.target;

    if (name === "duration") {
      value = value ? Number(value) : "";
    }

    setaddCourseData((prev) => ({ ...prev, [name]: value }));

    try {
      courseSchema.pick({ [name]: true }).parse({ [name]: value });
      seterrors((prev) => ({ ...prev, [name]: null }));
    } catch (error) {
      if (error.errors) {
        const errorMessage = error.errors.reduce((acc, err) => {
          acc[err.path[0]] = err.message;
          return acc;
        }, {});
        seterrors(errorMessage);
      }
    }
  }

  function handleCourseOutcomeChange(e) {
    let { value } = e.target;

    if (value.includes(",")) {
      const outcomes = value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      setcourseOutcomeList((prev) => [...prev, ...outcomes]);
      setaddCourseData((prev) => ({
        ...prev,
        courseOutcome: [...prev.courseOutcome, ...outcomes],
      }));

      e.target.value = "";
    }
  }

  function handleRemoveItem(index) {
    const newList = courseOutcomeList.filter((_, i) => i !== index);
    setcourseOutcomeList(newList);
    setaddCourseData((prev) => ({ ...prev, courseOutcome: newList }));
  }

  async function handleCreateCourse(e) {
    e.preventDefault();

    setLoading(true);

    if (!thumbnail) {
      setLoading(false)
      toast.error("Thumbnail is required");
      return;
    }

    const parsedData = courseSchema.safeParse(addCourseData);
    if (!parsedData.success) {
      setLoading(false);
      const firstError = parsedData.error.issues[0]?.message;
      toast.error(firstError);
      return;
    }

    let formdata = new FormData();
    formdata.append("title", addCourseData.title);
    formdata.append("description", addCourseData.description);
    formdata.append("category", addCourseData.category);
    formdata.append("level", addCourseData.level);
    formdata.append("price", addCourseData.price);
    formdata.append("thumbnail", thumbnail);
    formdata.append("duration", addCourseData.duration);
    addCourseData.courseOutcome.forEach(function (outcome) {
      formdata.append("courseOutcome[]", outcome);
    });

    try {
      await courseService.createCourse(formdata);
      toast.success("Course Created Successfully");
      setShowAddCourse(false);
      setLoading(false);
      let emptycourseOutcome = [];
      setaddCourseData((prev) => ({
        ...prev,
        title: "",
        description: "",
        category: "",
        level: "Beginner",
        price: "",
        duration: "",
        courseOutcome: emptycourseOutcome,
      }));
      refetch();
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        className="rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
        style={containerStyles}
      >
        <h2 className="text-2xl font-semibold mb-4">Add New Course</h2>
        <form onSubmit={handleCreateCourse} className="space-y-6">
          <FormFieldWithoutIcon
            label="Course Title"
            type="text"
            placeholder="Write Course Title"
            name="title"
            value={addCourseData.title}
            handleChange={handleAddCourseChange}
            error={errors.title}
            inputStyles={inputStyles}
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={addCourseData.description}
              onChange={handleAddCourseChange}
              placeholder="Write Course Description"
              rows={4}
              className="w-full px-4 py-2 resize-none border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              style={inputStyles}
            />
            {errors.description && (
              <p className="text-red-500 mt-2">{errors.description}</p>
            )}
          </div>

          {/* Category & Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category"
                value={addCourseData.category}
                onChange={handleAddCourseChange}
                className="w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                style={inputStyles}
              >
                <option value="">Select Category</option>
                <option value="programming">Programming</option>
                <option value="data science">Data Science</option>
                <option value="web development">Web Development</option>
                <option value="mobile development">Mobile Development</option>
                <option value="ui/ux design">UI/UX Design</option>
                <option value="cybersecurity">Cybersecurity</option>
                <option value="cloud computing">Cloud Computing</option>
                <option value="artificial intelligence & machine learning">
                  Artificial Intelligence & Machine Learning
                </option>
                <option value="business & entrepreneurship">
                  Business & Entrepreneurship
                </option>
                <option value="digital marketing">Digital Marketing</option>
                <option value="graphic design">Graphic Design</option>
                <option value="photography & video editing">
                  Photography & Video Editing
                </option>
              </select>
              {errors.category && (
                <p className="text-red-500 mt-2">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Level</label>
              <select
                name="level"
                value={addCourseData.level}
                onChange={handleAddCourseChange}
                className="w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                style={inputStyles}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              {errors.level && (
                <p className="text-red-500 mt-2">{errors.level}</p>
              )}
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
                value={addCourseData.price}
                onChange={handleAddCourseChange}
                className="w-full pl-8 pr-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                style={inputStyles}
              />
            </div>
            {errors.price && (
              <p className="text-red-500 mt-2">{errors.price}</p>
            )}
          </div>

          {/* Duration Field */}
          <FormFieldWithoutIcon
            label="Duration"
            type="number"
            placeholder="e.g., 12 weeks"
            name="duration"
            value={addCourseData.duration}
            handleChange={handleAddCourseChange}
            error={errors.duration}
            inputStyles={inputStyles}
          />

          <div>
            <label className="block text-smm font-medium mb-1">
              What Students will Learn
            </label>
            <div
              className="flex flex-wrap gap-2 p-2 border rounded-lg"
              style={inputStyles}
            >
              {courseOutcomeList.map((outcome, index) => (
                <span
                  key={index}
                  className="flex items-center bg-indigo-500 text-white px-2 py-1 rounded-lg"
                >
                  {outcome}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="ml-2 text-white font-bold hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                name="courseOutcome"
                placeholder="Type and press comma"
                onChange={handleCourseOutcomeChange}
                className="outline-none flex-grow bg-transparent px-2"
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
                onChange={(e) => setthumbnail(e.target.files[0])}
                className="hidden"
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
              type="button"
              onClick={() => setShowAddCourse(false)}
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
              className="px-4 py-2 rounded-lg flex gap-3 items-center justify-center  text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create Course
              {loading && <span class="loader"></span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;