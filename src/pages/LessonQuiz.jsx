import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ThemeDataContext } from "../context/ThemeContext";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const LessonQuiz = () => {
  let { courseId,lessonId } = useParams();
  let { darkMode } = useContext(ThemeDataContext);
  const navigate = useNavigate();
  let { currentQuiz } = useSelector((state) => state.quiz);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isNextEnabled, setIsNextEnabled] = useState(false);

  const [totalMarks, setTotalMarks] = useState(0);
  const [rightAnswers, setRightAnswers] = useState([]);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [rightMarks, setRightMarks] = useState(0);
  const [showRightMarks, setShowRightMarks] = useState(false);

  
  useEffect(() => {
    if (localStorage.getItem("quizCompleted") === "true") {
      navigate(`/classroom/${courseId}`); 
    }
  }, [navigate]);

  useEffect(() => {
    setSelectedOption(null);
    setIsNextEnabled(false);
    let newQuestions = [...(currentQuiz?.questions || [])];
    let correctAnswers = newQuestions.map((question) => question.correctOption);
    setAnswers(correctAnswers);
  }, [lessonId, currentQuestionIndex, currentQuiz]);

  function handleSelectOption(oIndex) {
    setSelectedOption(oIndex);
    if (oIndex === answers[currentQuestionIndex]) {
      setIsNextEnabled(true);
      setRightAnswers((prev) => [...prev, oIndex]);
    } else {
      setWrongAnswers((prev) => [...prev, oIndex]);
      setIsNextEnabled(false);
    }
  }

  useEffect(() => {
    let numberOfQuestions = currentQuiz?.questions?.length || 0;
    setTotalMarks(numberOfQuestions * 5);
    let newRightMarks = rightAnswers?.length * 5;
    setRightMarks(newRightMarks);
  }, [selectedOption, currentQuiz, rightAnswers]);

  const handleNextQuestion = () => {
    if (isNextEnabled) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsNextEnabled(false);
    }
  };

  const handleSubmit = () => {

    localStorage.setItem("quizCompleted", "true");
    setShowRightMarks(true);
    
    toast.success("Quiz submitted!");
  };

  return (
    <div className="w-full h-screen bg-[#101828] pt-10">
      <div
        className={`max-w-2xl mx-auto p-6 ${
          darkMode ? "bg-[#1E2939]" : "bg-white"
        } rounded-lg shadow-lg`}
      >
        {showRightMarks ? (
          <>
          <h1 className="text-2xl font-semibold text-white text-center">
            You Scored {rightMarks} marks 😊
          </h1>
          <div className="w-full flex justify-center text-white">
          <Link to={`/classroom/${courseId}`} className="px-3 py-2 bg-blue-600 rounded-lg mt-4">
            Go back to classroom
          </Link>
          </div>
          </>
        ) : (
          <>
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              } mb-4`}
            >
              Question {currentQuestionIndex + 1} /{" "}
              {currentQuiz?.questions?.length}
            </h2>
            <p
              className={`text-lg ${
                darkMode ? "text-gray-300" : "text-gray-700"
              } mb-6`}
            >
              {currentQuiz?.questions[currentQuestionIndex]?.questionText}
            </p>
            <div className="space-y-3">
              {currentQuiz?.questions[currentQuestionIndex]?.options?.map(
                (option, index) => {
                  let buttonBg = "bg-gray-200 dark:bg-gray-700";
                  if (selectedOption !== null && selectedOption === index) {
                    buttonBg =
                      index === answers[currentQuestionIndex]
                        ? "bg-green-600"
                        : "bg-red-500";
                  }
                  return (
                    <button
                      key={index}
                      onClick={() => handleSelectOption(index)}
                      className={`block w-full text-left ${buttonBg} text-gray-900 dark:text-white px-4 py-2 rounded-md transition`}
                    >
                      {option}
                    </button>
                  );
                }
              )}
            </div>
            <div className="flex justify-end mt-6">
              {currentQuestionIndex === currentQuiz?.questions?.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={!isNextEnabled}
                  className={`px-4 py-2 rounded-md transition ${
                    isNextEnabled
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-400 text-gray-700 cursor-not-allowed"
                  }`}
                >
                  Submit
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  disabled={!isNextEnabled}
                  className={`px-4 py-2 rounded-md transition ${
                    isNextEnabled
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-400 text-gray-700 cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LessonQuiz;
