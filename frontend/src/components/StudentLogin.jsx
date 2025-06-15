import React, { useContext, useEffect, useState } from "react";
import { BookOpen, Lock, Mail } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeDataContext } from "../context/ThemeContext";
import FormField from "./FormField";
import useFormHandler from "../hooks/useFormHandler";
import loginSchema from "../schemas/loginSchema";
import { toast } from "react-toastify";
import userService from "../services/User";
import { useDispatch } from "react-redux";
import SubmitBtn from "./SubmitBtn";

const StudentLogin = () => {
  const { darkMode } = useContext(ThemeDataContext);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const err = new URLSearchParams(location.search).get("error");
    if (err) {
      const map = {
        account_exists:
          "An account with this email already exists. Please log in first.",
        google_login_failed: "Google login failed. Please try again.",
        auth_failed: "Authentication failed. Please try again.",
      };
      toast.error(map[err] || "Something went wrong");
    }
  }, [location]);

  const { values, setvalues, handleChange, errors } = useFormHandler(
    { email: "", password: "" },
    loginSchema
  );

  async function handleLoginSubmit(e) {
    e.preventDefault();
    const newValues = { ...values, role: "student" };
    setvalues(newValues);

    setLoading(true);
    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      setLoading(false);
      toast.error(parsed.error.issues[0]?.message);
      return;
    }

    try {
      await userService.loginAccount(newValues);
      toast.success("Login successful");
      dispatch(setLoggedin(true));
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLogin() {
    window.open(
      "https://skillify-backend-7pex.onrender.com/api/users/google",
      "_self"
    );
  }

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-indigo-100 text-gray-900"
      } min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8`}
    >
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl space-y-10">
        {/* Header */}
        <div className="text-center">
          <span
            className={`inline-flex p-3 rounded-full shadow-lg ${
              darkMode ? "bg-gray-800" : "bg-white"
            } mb-4`}
          >
            <BookOpen
              className={`h-10 w-10 ${
                darkMode ? "text-indigo-400" : "text-indigo-600"
              }`}
            />
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2">
            Welcome Back
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
            Continue your learning journey
          </p>
        </div>

        {/* Card */}
        <div
          className={`rounded-2xl shadow-2xl ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          } py-6 sm:py-8 px-4 sm:px-6 md:px-8 lg:px-10`}
        >
          <form onSubmit={handleLoginSubmit} className="space-y-4 sm:space-y-6">
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
            <div>
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
              <div className="mt-1 text-right">
                <Link
                  to="/forgot-password"
                  className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <SubmitBtn loading={loading} btnText="Login" />
            <button
              type="button"
              onClick={handleGoogleLogin}
              className={`w-full h-10 sm:h-12 flex items-center justify-center gap-2 sm:gap-3 border-2 rounded-xl transition duration-200 ${
                darkMode
                  ? "border-gray-600 bg-gray-800 text-white hover:bg-gray-700"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.20-2.25H12v4.26h5.92c" fill="#4285F4" />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c" fill="#34A853" />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C" fill="#FBBC05" />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l" fill="#EA4335" />
              </svg>
              <span className="text-sm sm:text-base">Login with Google</span>
            </button>
          </form>

          <div className="mt-6 sm:mt-8 text-center space-y-1 sm:space-y-2">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              New to Skillify?{' '}
              <Link
                to="/register/student"
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Create an account
              </Link>
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Are you an instructor?{' '}
              <Link
                to="/login/instructor"
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Sign in as Instructor
              </Link>
            </p>
          </div>
        </div>

        {/* Terms */}
        <div className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          By signing in, you agree to our{' '}
          <Link href="#" className="underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" className="underline">
            Privacy Policy
          </Link>.
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
