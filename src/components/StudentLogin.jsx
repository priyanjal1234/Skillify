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
import { setLoggedin } from "../redux/reducers/UserReducer";
import SubmitBtn from "./SubmitBtn";

const StudentLogin = () => {
  const { darkMode } = useContext(ThemeDataContext);
  const [loading, setloading] = useState(false);

  let dispatch = useDispatch();
  let navigate = useNavigate();
  let location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const error = queryParams.get("error");

    if (error) {
      if (error === "account_exists") {
        toast.error(
          "An account with this email already exists. Please log in with your password first."
        );
      } else if (error === "google_login_failed") {
        toast.error("Google login failed. Please try again.");
      } else if (error === "auth_failed") {
        toast.error("Authentication failed. Please try again.");
      }
    }
  }, [location]);

  const { values, setvalues, handleChange, errors } = useFormHandler(
    {
      email: "",
      password: "",
    },
    loginSchema
  );

  async function handleLoginSubmit(e) {
    e.preventDefault();

    let newValues = { ...values };
    newValues.role = "student";
    setvalues(newValues);

    setloading(true);
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

  function handleGoogleLogin() {
    try {
      window.open("https://skillify-backend.onrender.com/api/users/google", "_self");
      dispatch(setLoggedin(true));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error logging in with Google"
      );
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 
      ${darkMode ? "bg-gray-900 text-white" : "bg-indigo-100 text-gray-900"}
    `}>
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className={`p-3 rounded-full shadow-lg 
              ${darkMode ? "bg-gray-800" : "bg-white"}
            `}>
              <BookOpen className={`h-10 w-10 
                ${darkMode ? "text-indigo-400" : "text-indigo-600"}
              `} />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-2">Welcome Back</h2>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-lg`}>
            Continue your learning journey
          </p>
        </div>

        {/* Login Form */}
        <div className={`py-8 px-6 sm:px-10 shadow-lg rounded-2xl 
          ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}
        `}>
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
            <Link to={"/forgot-password"} className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
              Forgot password?
            </Link>
            
            <SubmitBtn btnText="Login" loading = {loading} />

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center py-3 border-2 rounded-xl mt-4 transition duration-200 
                dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 
                border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            >
              <img src="https://www.svgrepo.com/show/303108/google-icon-logo.svg" className="h-5 w-5 mr-2" alt="Google Logo" />
              <span>Login with Google</span>
            </button>
          </form>

          {/* Sign Up & Instructor Login */}
          <div className="mt-8 text-center">
            <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>New to Skillify?</p>
            <Link to="/register/student" className="text-indigo-600 hover:text-indigo-500 font-medium block mt-2">
              Create an account
            </Link>
            <Link to="/login/instructor" className="text-indigo-600 hover:text-indigo-500 font-medium block mt-2">
              Sign in as instructor
            </Link>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="mt-6 text-center text-sm">
          By signing in, you agree to our{" "}
          <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms of Service</a> and{" "}
          <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
