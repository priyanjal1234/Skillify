import { motion } from "framer-motion";
import { useEffect } from "react";

const QuizModal = ({ showModal, setShowModal, handleTakeQuiz,lecIndex }) => {
  
  return (
    <div className=" inset-0  bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: -20, width: 0 }}
        animate={{ opacity: 1, y: 0, width: "90%" }}
        exit={{ opacity: 0, y: -20, width: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-auto"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Take the Quiz
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Would you like to test your knowledge on this lecture?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleTakeQuiz}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Take Quiz
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizModal;
