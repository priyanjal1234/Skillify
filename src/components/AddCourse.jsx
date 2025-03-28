import React, { useContext, useState } from "react";
import FormFieldWithoutIcon from "./FormFieldWithoutIcon";
import { ThemeDataContext } from "../context/ThemeContext";
import courseSchema from "../schemas/courseSchema";
import { toast } from "react-toastify";
import courseService from "../services/Course";
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
  const [thumbnail, setthumbnail] = useState();

  const containerStyles = {
    backgroundColor: darkMode ? "#1F2937" : "#ffffff",
    color: darkMode ? "#F3F4F6" : "#1F2937",
  };

  const inputStyles = {
    backgroundColor: darkMode ? "#374151" : "#F9FAFB",
    borderColor: darkMode ? "#4B5563" : "#D1D5DB",
    color: darkMode ? "#E5E7EB" : "#1F2937",
  };

  function handleAddCourseChange(e) {
    let { name, value } = e.target;
    if (name === "duration") value = value ? Number(value) : "";

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
      setLoading(false);
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
    addCourseData.courseOutcome.forEach((outcome) => {
      formdata.append("courseOutcome[]", outcome);
    });

    try {
      await courseService.createCourse(formdata);
      toast.success("Course Created Successfully");
      setShowAddCourse(false);
      setLoading(false);
      setaddCourseData({
        title: "",
        description: "",
        category: "",
        level: "Beginner",
        price: "",
        duration: "",
        courseOutcome: [],
      });
      refetch();
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        className="rounded-xl shadow-xl max-w-lg w-full max-h-screen overflow-y-auto p-6 md:max-w-2xl lg:max-w-3xl"
        style={containerStyles}
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Add New Course
        </h2>
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

          {/* Responsive Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormFieldWithoutIcon
              label="Category"
              type="text"
              placeholder="Course Category"
              name="category"
              value={addCourseData.category}
              handleChange={handleAddCourseChange}
              error={errors.category}
              inputStyles={inputStyles}
            />

            <FormFieldWithoutIcon
              label="Price (₹)"
              type="number"
              placeholder="Course Price"
              name="price"
              value={addCourseData.price}
              handleChange={handleAddCourseChange}
              error={errors.price}
              inputStyles={inputStyles}
            />
          </div>

          <FormFieldWithoutIcon
            label="Duration (weeks)"
            type="number"
            placeholder="e.g., 12"
            name="duration"
            value={addCourseData.duration}
            handleChange={handleAddCourseChange}
            error={errors.duration}
            inputStyles={inputStyles}
          />

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Course Thumbnail
            </label>
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={(e) => setthumbnail(e.target.files[0])}
              className="w-full border px-2 py-2 rounded-lg"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-end gap-4">
            <button
              type="button"
              onClick={() => setShowAddCourse(false)}
              className="px-4 py-2 border rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg flex gap-3 items-center justify-center text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create Course
              {loading && <span className="loader"></span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
