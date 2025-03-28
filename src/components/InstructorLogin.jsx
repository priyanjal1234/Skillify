import React, { useContext, useState } from "react";
import { ThemeDataContext } from "../context/ThemeContext";
import Navbar from "./Navbar";
import { BookOpen, Mail, Lock } from "lucide-react";
import FormField from "./FormField";
import { Link, useNavigate } from "react-router-dom";
import SubmitBtn from "./SubmitBtn";
import useFormHandler from "../hooks/useFormHandler";
import loginSchema from "../schemas/loginSchema";
import userService from "../services/User";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setLoggedin } from "../redux/reducers/UserReducer";

const InstructorLogin = () => {
  let { darkMode } = useContext(ThemeDataContext);

  let dispatch = useDispatch();
  let navigate = useNavigate();

  let { values, setvalues, handleChange, errors } = useFormHandler(
    { email: "", password: "" },
    loginSchema
  );
  const [loading, setloading] = useState(false);

  async function handleLoginSubmit(e) {
    e.preventDefault();
    setloading(true);

    let newValues = { ...values };
    newValues.role = "instructor";
    setvalues(newValues);

    const parsedData = loginSchema.safeParse(values);

    if (!parsedData.success) {
      setloading(false);
      const firstError = parsedData.error.issues[0]?.message;
      toast.error(firstError);
      return;
    }

    try {
      await userService.loginAccount(newValues);
      setloading(false);
      toast.success("Login Success");
      dispatch(setLoggedin(true));
      navigate("/");
    } catch (error) {
      setloading(false);
      toast.error(error?.response?.data?.message);
    }
  }

  async function handleGoogleLogin() {
    try {
      window.open(
        "https://skillify-backend.onrender.com/api/users/google",
        "_self"
      );
      dispatch(setLoggedin(true));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error logging with google"
      );
    }
  }

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-indigo-100 text-gray-900"
      } min-h-screen`}
    >
      <Navbar />

      <div className="py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full">
          {/* Logo & Welcome Message */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div
                className={`${
                  darkMode ? "bg-gray-800" : "bg-white"
                } p-3 rounded-full shadow-lg`}
              >
                <BookOpen
                  className={`h-10 w-10 ${
                    darkMode ? "text-indigo-400" : "text-indigo-600"
                  }`}
                />
              </div>
            </div>
            <h2 className="text-4xl font-extrabold mb-2">
              Welcome Back (Instructor)
            </h2>
            <p
              className={`${
                darkMode ? "text-gray-300" : "text-gray-600"
              } text-lg`}
            >
              Continue your teaching journey
            </p>
          </div>

          {/* Login Form */}
          <div
            className={`${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            } py-8 px-10 shadow-2xl rounded-2xl`}
          >
            <form onSubmit={handleLoginSubmit} className="space-y-6">
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
                <Link
                  to={"/forgot-password"}
                  className="text-sm text-indigo-600 mt-2 block dark:text-indigo-400 hover:text-indigo-500"
                >
                  Forgot password?
                </Link>
              </div>

              <div>
                <SubmitBtn btnText="Login" loading={loading} />
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className={`w-full h-12 mt-3 mb-8 flex items-center justify-center space-x-3 border-2 rounded-xl transition duration-200 ${
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
                    {darkMode ? "Login with Google" : "Login with Google"}
                  </span>
                </button>
              </div>
            </form>

            {/* Signup Link */}
            <div className="mt-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span
                    className={`${
                      darkMode
                        ? "bg-gray-800 text-gray-400"
                        : "bg-white text-gray-500"
                    } px-2`}
                  >
                    New to Skillify?
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <Link
                  to={"/register/instructor"}
                  className="mt-4 inline-block text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Sign Up as Instructor
                </Link>
                <Link
                  to={"/login/student"}
                  className="mt-2 inline-block text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Sign in as student
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorLogin;
