import React, { useContext } from "react";
import { ThemeDataContext } from "../context/ThemeContext";
import { Plus } from "lucide-react";

const AddLessonQuiz = () => {
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
        Quiz Questions
      </h2>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="quizQuestion"
            className={`block text-sm font-medium mb-1 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Question
          </label>
          <textarea
            id="quizQuestion"
            rows={2}
            placeholder="Enter quiz question"
            className={`w-full px-4 py-2 border-2 ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-gray-50 text-gray-900 border-gray-200"
            } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
          />
        </div>
        <div className="space-y-3">
          <label
            className={`block text-sm font-medium ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
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
              className={`flex-1 px-4 py-2 border-2 ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-gray-50 text-gray-900 border-gray-200"
              } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            />
          </div>
          <p className="text-sm text-gray-500">
            Select the radio button next to the correct answer.
          </p>
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
          <h3
            className={`text-sm font-medium mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Added Questions
          </h3>
          <p className="text-gray-500 text-sm">No quiz questions added</p>
        </div>
      </div>
    </div>
  );
};

export default AddLessonQuiz;
