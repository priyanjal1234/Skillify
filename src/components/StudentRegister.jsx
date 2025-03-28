import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormField from "./FormField";
import SubmitBtn from "./SubmitBtn";
import { BookOpen } from "lucide-react";
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
      } min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8`}
    >
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <div className="text-center mb-6">
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
          <h2 className="text-2xl sm:text-3xl font-extrabold">Join Skillify</h2>
          <p className="text-sm sm:text-base text-gray-400">
            Start your learning journey today
          </p>
        </div>

        <div
          className={`py-6 px-6 sm:px-8 md:px-10 shadow-2xl rounded-2xl ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <form onSubmit={handleRegisterSubmit} className="space-y-4 sm:space-y-6">
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

            <SubmitBtn loading={loading} btnText="Create Account" />

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center space-x-3 border-2 rounded-xl py-3 transition duration-200
              dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700
              border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
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
              </svg>
              <span className="font-medium">Continue with Google</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link to="/login/student" className="text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
            </p>
            <p className="text-sm text-gray-400">
              Want to be an Instructor?{" "}
              <Link to="/register/instructor" className="text-indigo-600 hover:text-indigo-500">
                Sign Up as Instructor
              </Link>
            </p>
          </div>
        </div>

        <Terms />
      </div>
    </div>
  );
};

export default StudentRegister;
