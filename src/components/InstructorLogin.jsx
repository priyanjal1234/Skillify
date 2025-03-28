import React, { useContext } from "react";
import { ThemeDataContext } from "../context/ThemeContext";
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

  async function handleLoginSubmit(e) {
    e.preventDefault();

    let newValues = { ...values };
    newValues.role = "instructor";
    setvalues(newValues);

    const parsedData = loginSchema.safeParse(values);

    if (!parsedData.success) {
      const firstError = parsedData.error.issues[0]?.message;
      toast.error(firstError);
      return;
    }

    try {
      await userService.loginAccount(newValues);
      toast.success("Login Success");
      dispatch(setLoggedin(true));
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  async function handleGoogleLogin() {
    try {
      window.open("https://skillify-backend.onrender.com/api/users/google", "_self");
      dispatch(setLoggedin(true));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error logging with Google"
      );
    }
  }

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-indigo-100 text-gray-900"
      } min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8`}
    >
      <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
        {/* Logo & Welcome Message */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } p-3 rounded-full shadow-lg`}
            >
              <BookOpen className={`h-12 w-12 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2">
            Welcome Back (Instructor)
          </h2>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm sm:text-lg`}>
            Continue your teaching journey
          </p>
        </div>

        {/* Login Form */}
        <div
          className={`${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          } py-6 sm:py-8 px-6 sm:px-10 shadow-2xl rounded-lg md:rounded-2xl`}
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
              <SubmitBtn btnText="Login" />
              <button
                type="button"
                onClick={handleGoogleLogin}
                className={`w-full h-12 flex items-center justify-center space-x-3 border-2 rounded-lg transition duration-200 
                  ${
                    darkMode
                      ? "border-gray-600 bg-gray-800 text-white hover:bg-gray-700"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <img src="/google-logo.svg" alt="Google" className="h-5 w-5" />
                <span className="font-medium">Login with Google</span>
              </button>
            </div>
          </form>

          {/* Signup Links */}
          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`${darkMode ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"} px-2`}>
                  New to Skillify?
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <Link to={"/register/instructor"} className="mt-4 text-indigo-600 hover:text-indigo-500 font-medium">
                Sign Up as Instructor
              </Link>
              <Link to={"/login/student"} className="mt-2 text-indigo-600 hover:text-indigo-500 font-medium">
                Sign in as Student
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorLogin;
