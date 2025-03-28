import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormField from "./FormField";
import { BookOpen, User, Mail, Lock } from "lucide-react";
import { ThemeDataContext } from "../context/ThemeContext";
import SubmitBtn from "./SubmitBtn";
import useFormHandler from "../hooks/useFormHandler";
import registerSchema from "../schemas/registerSchema";
import { toast } from "react-toastify";
import userService from "../services/User";
import { useDispatch } from "react-redux";
import { setLoggedin } from "../redux/reducers/UserReducer";
import Terms from "./Terms";

const InstructorRegister = () => {
  const { darkMode } = useContext(ThemeDataContext);
  const [loading, setloading] = useState(false);

  let dispatch = useDispatch();
  let navigate = useNavigate();

  const { values, handleChange, errors } = useFormHandler(
    { name: "", email: "", password: "", role: "instructor" },
    registerSchema
  );

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    setloading(true);

    const parsedResult = registerSchema.safeParse(values);
    if (!parsedResult.success) {
      setloading(false);
      toast.error(parsedResult.error.issues[0]?.message);
      return;
    }

    try {
      await userService.createAccount(values);
      toast.success("Check your email for verification");
      setloading(false);
      dispatch(setLoggedin(true));
      navigate("/verify-email");
    } catch (error) {
      setloading(false);
      toast.error(error?.response?.data?.message);
    }
  }

  async function handleGoogleLogin() {
    try {
      window.open("https://skillify-backend.onrender.com/api/users/google", "_self");
      dispatch(setLoggedin(true));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error logging in with Google");
    }
  }

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen flex flex-col justify-center items-center px-4`}>
      <div className="max-w-lg w-full p-6 md:p-8 lg:p-10">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className={`p-3 rounded-full shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <BookOpen className={`h-10 w-10 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2">Join Skillify as Instructor</h2>
          <p className="text-base sm:text-lg text-gray-400">Start your teaching journey today</p>
        </div>

        <div className={`py-6 px-6 sm:px-8 md:px-10 shadow-lg rounded-2xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <form onSubmit={handleRegisterSubmit} className="space-y-4 sm:space-y-6">
            <FormField label="Full Name" icon={User} type="text" name="name" value={values.name} handleChange={handleChange} placeholder="John Doe" error={errors.name} />
            <FormField label="Email Address" icon={Mail} type="email" name="email" value={values.email} handleChange={handleChange} placeholder="you@example.com" error={errors.email} />
            <FormField label="Password" icon={Lock} type="password" name="password" value={values.password} handleChange={handleChange} placeholder="••••••••" error={errors.password} />

            <SubmitBtn btnText="Create Account" loading={loading} />

            <button type="button" onClick={handleGoogleLogin} className={`w-full h-12 flex items-center justify-center space-x-3 border-2 rounded-xl transition duration-200 
              ${darkMode ? "border-gray-600 bg-gray-800 text-white hover:bg-gray-700" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"}`}>
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="font-medium">Continue with Google</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Already have an account?</p>
            <Link to={"/login/instructor"} className="text-indigo-500 hover:underline">Sign in to your account</Link>
            <Link to={"/register/student"} className="block mt-2 text-indigo-500 hover:underline">Sign Up as Student</Link>
          </div>
        </div>
        <Terms />
      </div>
    </div>
  );
};

export default InstructorRegister;
