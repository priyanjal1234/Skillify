import React, { useContext } from "react";
import { Link } from "react-router-dom";
import FormField from "./FormField";
import { BookOpen } from "lucide-react";
import Navbar from "./Navbar";
import { ThemeDataContext } from "../context/ThemeContext";
import { User,Mail,Lock } from "lucide-react";
import SubmitBtn from "./SubmitBtn";
import Terms from "./Terms";

const InstructorRegister = () => {
  const { darkMode } = useContext(ThemeDataContext);
  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } min-h-screen`}
    >
      <Navbar />

      <div className="flex justify-center items-center min-h-screen">
        <div className="max-w-md w-full p-6">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div
                className={`p-3 rounded-full shadow-lg ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <BookOpen
                  className={`h-10 w-10 ${
                    darkMode ? "text-indigo-400" : "text-indigo-600"
                  }`}
                />
              </div>
            </div>
            <h2 className="text-4xl font-extrabold mb-2">Join EduLearn</h2>
            <p className="text-lg text-gray-400">
              Start your learning journey today
            </p>
          </div>

          <div
            className={`py-8 px-10 shadow-2xl rounded-2xl ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <form className="space-y-6">
              {/* Full Name Field */}
              <FormField
                label="Full Name"
                icon={User}
                type="text"
                placeholder="John Doe"
              />

              {/* Email Field */}
              <FormField
                label="Email Address"
                icon={Mail}
                type="email"
                placeholder="you@example.com"
              />

              {/* Password Field */}
              <FormField
                label="Password"
                icon={Lock}
                type="password"
                placeholder="••••••••"
              />
              {/* Register Button */}
              <SubmitBtn btnText="Create Account" />
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div
                    className={`w-full border-t ${
                      darkMode ? "border-gray-600" : "border-gray-200"
                    }`}
                  ></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span
                    className={`px-2 ${
                      darkMode
                        ? "bg-gray-800 text-gray-400"
                        : "bg-white text-gray-500"
                    }`}
                  >
                    Already have an account?
                  </span>
                </div>
              </div>
              <Link
                to="/login"
                className={`mt-4 inline-block font-medium ${
                  darkMode
                    ? "text-indigo-400 hover:text-indigo-300"
                    : "text-indigo-600 hover:text-indigo-500"
                }`}
              >
                Sign in to your account
              </Link>
              <Link to="/" />
            </div>
          </div>
          <Terms />
        </div>
      </div>
    </div>
  );
};

export default InstructorRegister;
