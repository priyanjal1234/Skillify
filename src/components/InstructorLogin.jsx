import React, { useContext } from "react";
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

  async function handleLoginSubmit(e) {
    e.preventDefault();

    setvalues(() => {
      let newValues = { ...values };
      newValues.role = "instructor";
      return newValues;
    });

    const parsedData = loginSchema.safeParse(values);

    if (!parsedData.success) {
      const firstError = parsedData.error.issues[0]?.message;
      toast.error(firstError);
      return;
    }

    try {
      await userService.loginAccount(values);
      toast.success("Login Success");
      dispatch(setLoggedin(true));
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message);
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
                  to="/forgot-password"
                  className="text-sm text-indigo-600 mt-2 block dark:text-indigo-400 hover:text-indigo-500"
                >
                  Forgot password?
                </Link>
              </div>

              <div>
                <SubmitBtn btnText="Login" />
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
                  to="/register/instructor"
                  className="mt-4 inline-block text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Create an account
                </Link>
                <Link
                  to="/login/student"
                  className="mt-2 inline-block text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Sign in as student
                </Link>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="mt-6 text-center text-sm">
            By signing in, you agree to our{" "}
            <a href="#" className="text-indigo-600 hover:text-indigo-500">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-indigo-600 hover:text-indigo-500">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorLogin;
