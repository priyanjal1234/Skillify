import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import FormField from "./FormField";
import SubmitBtn from "./SubmitBtn";
import { ThemeDataContext } from "../context/ThemeContext";
import { User, Mail, Lock } from "lucide-react";
import Terms from "./Terms";
import useFormHandler from "../hooks/useFormHandler";
import registerSchema from "../schemas/registerSchema";
import userService from "../services/User";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setLoggedin } from "../redux/reducers/UserReducer";

const StudentRegister = () => {
  const [loading, setloading] = useState(false);
  const { darkMode } = useContext(ThemeDataContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { values, errors, handleChange } = useFormHandler(
    { name: "", email: "", password: "", role: "student" },
    registerSchema
  );

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    setloading(true);

    const parsedData = registerSchema.safeParse(values);
    if (!parsedData.success) {
      setloading(false);
      toast.error(parsedData.error.issues[0]?.message);
      return;
    }

    try {
      await userService.createAccount(values);
      toast.success("Check Your Email For Email Verification");
      setloading(false);
      navigate("/verify-email");
    } catch (error) {
      setloading(false);
      toast.error(error?.response?.data?.message || "Error Registering User");
    }
  }

  async function handleGoogleLogin() {
    try {
      window.open(
        "https://skillify-backend-7pex.onrender.com/api/users/google",
        "_self"
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error logging in with Google"
      );
    }
  }

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8`}
    >
      <div className="w-full max-w-lg space-y-10">
        {/* Brand & Heading */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <span
              className={`p-3 rounded-full shadow-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <BookOpen
                className={`h-10 w-10 ${
                  darkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              />
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-2">
            Join Skillify
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            Start your learning journey today
          </p>
        </div>

        {/* Card */}
        <div
          className={`rounded-2xl shadow-2xl ${
            darkMode ? "bg-gray-800" : "bg-white"
          } py-8 px-6 sm:px-8 md:px-10`}
        >
          <form onSubmit={handleRegisterSubmit} className="space-y-6">
            {/* Full Name */}
            <FormField
              label="Full Name"
              icon={User}
              type="text"
              placeholder="John Doe"
              name="name"
              value={values.name}
              handleChange={handleChange}
              error={errors.name}
            />

            {/* Email */}
            <FormField
              label="Email Address"
              icon={Mail}
              type="email"
              placeholder="you@example.com"
              name="email"
              value={values.email}
              handleChange={handleChange}
              error={errors.email}
            />

            {/* Password */}
            <FormField
              label="Password"
              icon={Lock}
              type="password"
              placeholder="••••••••"
              name="password"
              value={values.password}
              handleChange={handleChange}
              error={errors.password}
            />

            {/* Submit */}
            <SubmitBtn loading={loading} btnText="Create Account" />

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className={`w-full h-12 flex items-center justify-center gap-3 border-2 rounded-xl transition duration-200 ${
                darkMode
                  ? "border-gray-600 bg-gray-800 text-white hover:bg-gray-700"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {/* Google Icon */}
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="font-medium">Continue with Google</span>
            </button>
          </form>

          {/* Links */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login/student"
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Sign in to your account
              </Link>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Want to teach?{' '}
              <Link
                to="/register/instructor"
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Sign Up as Instructor
              </Link>
            </p>
          </div>
        </div>

        {/* Terms */}
        <Terms />
      </div>
    </div>
  );
};

export default StudentRegister;