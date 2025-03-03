import React, { useContext, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Upload,
  Video,
  FileText,
  Link as LinkIcon,
  Clock,
  CheckSquare,
} from "lucide-react";
import { ThemeDataContext } from "../context/ThemeContext";

const AddLesson = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeDataContext);

  let videoRef = useRef(null)

  return (
    <div className={`${darkMode ? "bg-gray-900" : "bg-gray-50"} min-h-screen`}>
      {/* Header */}
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} shadow`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link
                to={`/edit-course/${courseId}`}
                className={`${darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                Add New Lesson
              </h1>
            </div>
            <button className="px-6 py-2 rounded-lg text-white font-medium flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700">
              <Save className="h-5 w-5" />
              <span>Save Lesson</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-sm p-6`}>
              <h2 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                Lesson Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter lesson title"
                    className={`w-full px-4 py-2 border-2 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-gray-50 text-gray-900 border-gray-200"} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                </div>
                <div>
                  <label htmlFor="content" className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Content
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    rows={4}
                    placeholder="Describe what students will learn in this lesson"
                    className={`w-full px-4 py-2 border-2 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-gray-50 text-gray-900 border-gray-200"} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                </div>
                <div>
                  <label htmlFor="videoUrl" className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Video URL
                  </label>
                  <div className="flex">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Video className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="url"
                        id="videoUrl"
                        name="videoUrl"
                        placeholder="https://example.com/video"
                        className={`pl-10 w-full px-4 py-2 border-2 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-gray-50 text-gray-900 border-gray-200"} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      />
                    </div>
                    <input ref={videoRef} type="file" className="hidden"/>
                    <button
                      onClick={() => videoRef.current.click()}
                      type="button"
                      className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      <Upload className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="duration" className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Duration (minutes)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      placeholder="15"
                      min="1"
                      className={`pl-10 w-full px-4 py-2 border-2 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-gray-50 text-gray-900 border-gray-200"} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublished"
                    name="isPublished"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPublished" className={`ml-2 block text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Publish this lesson immediately
                  </label>
                </div>
              </div>
            </div>

            {/* Resources Section */}
            <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-sm p-6`}>
              <h2 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                Additional Resources
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label htmlFor="resourceType" className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Type
                    </label>
                    <select
                      id="resourceType"
                      name="type"
                      className={`w-full px-4 py-2 border-2 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-gray-50 text-gray-900 border-gray-200"} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    >
                      <option value="pdf">PDF Document</option>
                      <option value="link">External Link</option>
                      <option value="video">Additional Video</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="resourceTitle" className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Title
                    </label>
                    <input
                      type="text"
                      id="resourceTitle"
                      name="title"
                      placeholder="Resource title"
                      className={`w-full px-4 py-2 border-2 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-gray-50 text-gray-900 border-gray-200"} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    />
                  </div>
                  <div>
                    <label htmlFor="resourceUrl" className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      URL
                    </label>
                    <input
                      type="url"
                      id="resourceUrl"
                      name="url"
                      placeholder="https://example.com/resource"
                      className={`w-full px-4 py-2 border-2 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-gray-50 text-gray-900 border-gray-200"} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
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
                  <h3 className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Added Resources
                  </h3>
                  <p className="text-gray-500 text-sm">No resources added</p>
                </div>
              </div>
            </div>

            {/* Quiz Section */}
            <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-sm p-6`}>
              <h2 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                Quiz Questions
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="quizQuestion" className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Question
                  </label>
                  <textarea
                    id="quizQuestion"
                    rows={2}
                    placeholder="Enter quiz question"
                    className={`w-full px-4 py-2 border-2 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-gray-50 text-gray-900 border-gray-200"} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                </div>
                <div className="space-y-3">
                  <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Answer Options
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="option-0"
                      name="correctOption"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <input
                      type="text"
                      placeholder="Option 1"
                      className={`flex-1 px-4 py-2 border-2 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-gray-50 text-gray-900 border-gray-200"} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    />
                  </div>
                  <p className="text-sm text-gray-500">Select the radio button next to the correct answer.</p>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Question</span>
                  </button>
                </div>
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <h3 className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Added Questions
                  </h3>
                  <p className="text-gray-500 text-sm">No quiz questions added</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-sm p-6 sticky top-8`}>
              <h2 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                Lesson Preview
              </h2>
              <div
                className="aspect-video rounded-lg mb-4 flex items-center justify-center"
                style={{ backgroundColor: darkMode ? "#4B5563" : "#E5E7EB" }}
              >
                <p className="text-gray-500 text-sm">Video preview will appear here</p>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Title
                  </h3>
                  <p className={`${darkMode ? "text-white" : "text-gray-900"} font-medium`}>
                    Untitled Lesson
                  </p>
                </div>
                <div>
                  <h3 className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Description
                  </h3>
                  <p className="text-gray-500 text-sm">No description provided</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Duration
                    </h3>
                    <p className={darkMode ? "text-white" : "text-gray-900"}>Not specified</p>
                  </div>
                  <div>
                    <h3 className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Status
                    </h3>
                    <p className="text-sm font-medium text-yellow-600">Draft</p>
                  </div>
                </div>
                <div>
                  <h3 className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Resources
                  </h3>
                  <p className="text-gray-500 text-sm">No resources added</p>
                </div>
                <div>
                  <h3 className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Quiz Questions
                  </h3>
                  <p className="text-gray-500 text-sm">No quiz questions added</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLesson;
