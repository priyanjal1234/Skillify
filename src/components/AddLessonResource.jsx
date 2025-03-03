import React, { useContext } from "react";
import { ThemeDataContext } from "../context/ThemeContext";
import { Plus } from "lucide-react";

const AddLessonResource = () => {
  let { darkMode } = useContext(ThemeDataContext);
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
              htmlFor="resourceUrl"
              className={`block text-sm font-medium mb-1 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              URL
            </label>
            <input
              type="url"
              id="resourceUrl"
              name="url"
              placeholder="https://example.com/resource"
              className={`w-full px-4 py-2 border-2 ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-gray-50 text-gray-900 border-gray-200"
              } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Resource</span>
          </button>
        </div>
        <div className="mt-4 border-t border-gray-200 pt-4">
          <h3
            className={`text-sm font-medium mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Added Resources
          </h3>
          <p className="text-gray-500 text-sm">No resources added</p>
        </div>
      </div>
    </div>
  );
};

export default AddLessonResource;
