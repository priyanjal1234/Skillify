import { motion } from "framer-motion";
import { useEffect } from "react";

const QuizModal = ({ showModal, setShowModal, handleTakeQuiz, lecIndex }) => {
  // Close modal on backdrop click
  const closeModal = (e) => {
    if (e.target.id === "quiz-modal-backdrop") {
      setShowModal(false);
    }
  };

  useEffect(() => {
    // Prevent scrolling when modal is open
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  return showModal ? (
    <div
      id="quiz-modal-backdrop"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
      onClick={closeModal}
    >
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md sm:max-w-lg lg:max-w-xl"
      >
        {/* Title */}
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Take the Quiz
        </h2>
        
        {/* Description */}
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">
          Would you like to test your knowledge on lecture {lecIndex}?
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => setShowModal(false)}
            className="w-full sm:w-auto px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleTakeQuiz}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Take Quiz
          </button>
        </div>
      </motion.div>
    </div>
  ) : null;
};

export default QuizModal;
