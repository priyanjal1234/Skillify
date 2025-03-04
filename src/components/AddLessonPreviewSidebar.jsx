import React, { useContext } from "react";
import { ThemeDataContext } from "../context/ThemeContext";

const AddLessonPreviewSidebar = ({
  previewTitle,
  previewDescription,
  previewDuration,
  thumbnail,
}) => {
  let { darkMode } = useContext(ThemeDataContext);

  return (
    <div className="lg:col-span-1">
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-xl shadow-sm p-6 sticky top-8`}
      >
        <h2
          className={`text-lg font-semibold mb-4 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Lesson Preview
        </h2>
        <div
          className="aspect-video rounded-lg mb-4 flex items-center justify-center"
          style={{ backgroundColor: darkMode ? "#4B5563" : "#E5E7EB" }}
        >
          {thumbnail ? (
            <img
              src={thumbnail}
              alt="Video Thumbnail"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          ) : (
            <h3 className="text-gray-400">Video thumbnail comes here</h3>
          )}
        </div>
        <div className="space-y-4">
          <div>
            <h3
              className={`text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Title
            </h3>
            <p
              className={`${
                darkMode ? "text-white" : "text-gray-900"
              } font-medium`}
            >
              {previewTitle}
            </p>
          </div>
          <div>
            <h3
              className={`text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Description
            </h3>
            <p className="text-gray-500 text-sm">{previewDescription}</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Duration
              </h3>
              <p className={darkMode ? "text-white" : "text-gray-900"}>
                {previewDuration}
              </p>
            </div>
          </div>
          <div>
            <h3
              className={`text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Resources
            </h3>
            <p className="text-gray-500 text-sm">No resources added</p>
          </div>
          <div>
            <h3
              className={`text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Quiz Questions
            </h3>
            <p className="text-gray-500 text-sm">No quiz questions added</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLessonPreviewSidebar;
