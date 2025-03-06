import React, { useContext, useState } from "react";
import { ThemeDataContext } from "../context/ThemeContext";
import { Plus } from "lucide-react";

const AddLessonQuiz = () => {
  let { darkMode } = useContext(ThemeDataContext);

  // State for all questions
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options: [{ text: "", id: 1 }],
      correctOption: null,
    },
  ]);

  // Function to update the question text
  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  // Function to update an option text
  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex].text = value;
    setQuestions(newQuestions);
  };

  // Function to add a new option to a question
  const addOption = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push({
      text: "",
      id: newQuestions[qIndex].options.length + 1,
    });
    setQuestions(newQuestions);
  };

  // Function to add a new question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: [{ text: "", id: 1 }],
        correctOption: null,
      },
    ]);
  };

  // Function to select the correct answer
  const selectCorrectOption = (qIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctOption = optionIndex;
    setQuestions(newQuestions);
  };

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
      <div className="space-y-6">
        {questions.map((question, qIndex) => (
          <div key={qIndex} className="p-4 border rounded-lg space-y-4">
            {/* Question Input */}
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Question {qIndex + 1}
              </label>
              <textarea
                value={question.questionText}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                rows={2}
                placeholder="Enter quiz question"
                className={`w-full px-4 py-2 border-2 ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-gray-50 text-gray-900 border-gray-200"
                } rounded-lg focus:ring-2 focus:ring-indigo-500`}
              />
            </div>

            {/* Options */}
            <div className="space-y-3">
              <label
                className={`block text-sm font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Answer Options
              </label>
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`correctOption-${qIndex}`}
                    checked={question.correctOption === oIndex}
                    onChange={() => selectCorrectOption(qIndex, oIndex)}
                    className="h-4 w-4 text-indigo-600"
                  />
                  <input
                    type="text"
                    placeholder={`Option ${oIndex + 1}`}
                    value={option.text}
                    onChange={(e) =>
                      handleOptionChange(qIndex, oIndex, e.target.value)
                    }
                    className={`flex-1 px-4 py-2 border-2 ${
                      darkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-gray-50 text-gray-900 border-gray-200"
                    } rounded-lg focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => addOption(qIndex)}
                className="text-sm text-indigo-600 hover:underline"
              >
                + Add Option
              </button>
            </div>
          </div>
        ))}

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={addQuestion}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Question</span>
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2">
            Create Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLessonQuiz;
