import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeDataContext } from "../context/ThemeContext";
import { useSelector } from "react-redux";

const CalltoAction = () => {
  const { darkMode } = useContext(ThemeDataContext);
  let { isLoggedin } = useSelector((state) => state.user);

  return (
    <section className={`${darkMode ? "bg-indigo-700" : "bg-indigo-800"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to Start Learning?
        </h2>
        <p className="mb-6 text-indigo-100 max-w-2xl mx-auto">
          Join thousands of students already learning on our platform.
        </p>
        {!isLoggedin && (
          <Link
            to={`/register/student`}
            className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors duration-200"
          >
            Sign Up Now
          </Link>
        )}
      </div>
    </section>
  );
};

export default CalltoAction;
