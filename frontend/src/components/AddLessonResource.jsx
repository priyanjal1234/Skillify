import React, { useContext, useState } from "react";
import { ThemeDataContext } from "../context/ThemeContext";
import { Plus, Upload } from "lucide-react";
import { useParams } from "react-router-dom";
import resourceService from "../services/Resource";
import { toast } from "react-toastify";

const AddLessonResource = () => {
  let { darkMode } = useContext(ThemeDataContext);
  let { courseId, lessonId } = useParams();
  const [loading, setloading] = useState(false);

  const [type, settype] = useState("pdf");
  const [title, settitle] = useState("");
  const [pdf, setpdf] = useState();

  async function handleAddResource() {
    setloading(true);
    let formdata = new FormData();
    formdata.append("type", type);
    formdata.append("title", title);
    formdata.append("pdf", pdf);

    try {
      let createResourceRes = await resourceService.createResource(
        formdata,
        lessonId
      );
      setloading(false);
      toast.success("Resource Created Successfully");
      settype("");
      settitle("");
    } catch (error) {
      setloading(false);
      toast.error(error?.response?.data?.message);
    }
  }

  return (
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
        Additional Resources
      </h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label
              htmlFor="resourceType"
              className={`block text-sm font-medium mb-1 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Type
            </label>
            <select
              id="resourceType"
              name="type"
              value={type}
              onChange={(e) => settype(e.target.value)}
              className={`w-full px-4 py-2 border-2 ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-gray-50 text-gray-900 border-gray-200"
              } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            >
              <option value="pdf">PDF Document</option>
              <option value="link">External Link</option>
              <option value="video">Additional Video</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="resourceTitle"
              className={`block text-sm font-medium mb-1 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Title
            </label>
            <input
              type="text"
              id="resourceTitle"
              name="title"
              value={title}
              onChange={(e) => settitle(e.target.value)}
              placeholder="Resource title"
              className={`w-full px-4 py-2 border-2 ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-gray-50 text-gray-900 border-gray-200"
              } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            />
          </div>
          <div>
            <label
              htmlFor="resourceFile"
              className={`block text-sm font-medium mb-1 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Upload File
            </label>
            <div className="flex items-center">
              <input
                type="file"
                id="resourceFile"
                name="pdf"
                onChange={(e) => setpdf(e.target.files[0])}
                className="hidden"
              />
              <label
                htmlFor="resourceFile"
                className="cursor-pointer flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                <Upload className="h-4 w-4" />
                <span>Choose File</span>
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-start">
          <button
            onClick={handleAddResource}
            type="button"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Resource</span>
            {loading && <span className="loader"></span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLessonResource;
