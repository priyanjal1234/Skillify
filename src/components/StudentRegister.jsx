import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormField from "./FormField";
import SubmitBtn from "./SubmitBtn";
import { BookOpen } from "lucide-react";
import Navbar from "./Navbar";
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
  let navigate = useNavigate();
  let dispatch = useDispatch();

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
      const firstError = parsedData.error.issues[0]?.message;
      toast.error(firstError);
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
      window.open("https://skillify-backend.onrender.com/api/users/google", "_self");
      dispatch(setLoggedin(true))
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
      } min-h-screen`}
    >
    

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
            <h2 className="text-4xl font-extrabold mb-2">Join Skillify</h2>
            <p className="text-lg text-gray-400">
              Start your learning journey today
            </p>
          </div>

          <div
            className={`py-8 px-10 shadow-2xl rounded-2xl ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              {/* Full Name Field */}
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

              {/* Email Field */}
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

              {/* Password Field */}
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
              {/* Register Button */}
              <SubmitBtn loading={loading} btnText="Create Account" />

              <button
                type="button"
                onClick={handleGoogleLogin}
                className={`w-full h-12 mb-8 flex items-center justify-center space-x-3 border-2 rounded-xl transition duration-200 
    ${
      darkMode
        ? "border-gray-600 bg-gray-800 text-white hover:bg-gray-700"
        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
    }`}
              >
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
                <span className="font-medium">
                  {darkMode ? "Continue with Google" : "Continue with Google"}
                </span>
              </button>
            </form>
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
                to={"/login/student"}
                className={`mt-4 inline-block font-medium ${
                  darkMode
                    ? "text-indigo-400 hover:text-indigo-300"
                    : "text-indigo-600 hover:text-indigo-500"
                }`}
              >
                Sign in to your account
              </Link>
              <Link
                to={"/register/instructor"}
                className={`mt-4 inline-block font-medium ${
                  darkMode
                    ? "text-indigo-400 hover:text-indigo-300"
                    : "text-indigo-600 hover:text-indigo-500"
                }`}
              >
                Sign Up as Instructor
              </Link>
            </div>
          </div>
          <Terms />
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;
