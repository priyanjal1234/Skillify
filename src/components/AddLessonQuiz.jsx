import React, { useContext, useState } from "react";
import { ThemeDataContext } from "../context/ThemeContext";
import { Plus } from "lucide-react";
import quizService from "../services/Quiz";
import { toast } from "react-toastify";

const AddLessonQuiz = ({ lessonId }) => {
  let { darkMode } = useContext(ThemeDataContext);

  const [questions, setquestions] = useState([
    {
      questionText: "",
      options: [{ optionText: "", id: 1 }],
      correctOption: null,
    },
  ]);

  function handleQuestionChange(index, value) {
    let newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setquestions(newQuestions);
  }

  function handleOptionChange(qIndex, oIndex, value) {
    let newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex].optionText = value;
    setquestions(newQuestions);
  }

  function handleAddQuestion() {
    setquestions([
      ...questions,
      {
        questionText: "",
        options: [{ optionText: "", id: 1 }],
        correctOption: null,
      },
    ]);
  }

  function handleAddOption(qIndex) {
    let newQuestions = [...questions];
    newQuestions[qIndex].options.push({
      optionText: "",
      id: newQuestions[qIndex].options.length + 1,
      correctOption: null,
    });
    setquestions(newQuestions);
  }

  function selectCorrectOption(qIndex, oIndex) {
    let newQuestions = [...questions];
    newQuestions[qIndex].correctOption = oIndex;
    setquestions(newQuestions);
  }

  async function handleCreateQuiz() {
    let dataToSend = {
      questions: questions.map((q) => ({
        questionText: q.questionText,
        options: q.options.map((o) => o.optionText),
        correctOption: q.correctOption,
      })),
    };

    try {
      let createQuizRes = await quizService.createQuiz(dataToSend, lessonId);
      toast.success("Quiz Created Successfully");
      let newQuestions = [...questions];
      newQuestions = [
        {
          questionText: "",
          options: [{ optionText: "", id: 1 }],
          correctOption: null,
        },
      ];
      setquestions(newQuestions);
    } catch (error) {
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
        Quiz Questions
      </h2>
      <div className="space-y-6">
        {questions.map((question, qIndex) => (
          <div className="p-4 border rounded-lg space-y-4">
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
                rows={2}
                value={question.questionText}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
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
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`correctOption-${qIndex}`}
                    checked={question.correctOption === oIndex}
                    onChange={() => selectCorrectOption(qIndex, oIndex)}
                    className="h-4 w-4 text-indigo-600"
                  />

                  <input
                    type="text"
                    placeholder={`Option `}
                    value={option.optionText}
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
                onClick={() => handleAddOption(qIndex)}
                type="button"
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
            onClick={handleAddQuestion}
            type="button"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Question</span>
          </button>
          <button
            onClick={handleCreateQuiz}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
          >
            Create Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLessonQuiz;
