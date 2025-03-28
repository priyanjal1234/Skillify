import { ArrowLeft, Lock, Shield, Mail } from "lucide-react";
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormField from "../components/FormField";
import resetPasswordSchema from "../schemas/resetPasswordSchema";
import { z } from "zod";
import { ThemeDataContext } from "../context/ThemeContext";
import SubmitBtn from "../components/SubmitBtn";
import userService from "../services/User";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { darkMode } = useContext(ThemeDataContext);
  let navigate = useNavigate();

  function handleChange(e) {
    let { name, value } = e.target;

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }

    try {
      resetPasswordSchema
        .pick({ password: true })
        .parse({ password: value });
      setError("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      }
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();

    try {
      const parsedData = resetPasswordSchema.parse({ email, password });

      await userService.resetPassword(email, password);
      toast.success("Password Reset Successfully");
      navigate("/login/student");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0]?.message);
      } else {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    }
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-indigo-100 to-purple-100"
      }`}
    >
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div
              className={`p-3 rounded-full shadow-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <Shield
                className={`h-10 w-10 ${
                  darkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Set New Password</h2>
          <p className="text-sm md:text-lg text-gray-600 dark:text-gray-300">
            Choose a strong password for your account
          </p>
        </div>

        {/* Form Section */}
        <div
          className={`py-6 px-6 md:px-10 shadow-lg rounded-lg ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <form onSubmit={handleResetPassword} className="space-y-5">
            <FormField
              label="Email"
              icon={Mail}
              type="email"
              placeholder="you@example.com"
              name="email"
              value={email}
              handleChange={handleChange}
              error={error.email}
            />

            <FormField
              label="New Password"
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              name="password"
              value={password}
              handleChange={handleChange}
              error={error.password}
            />

            <div>
              <SubmitBtn btnText="Reset Password" loading={loading} />
            </div>
          </form>

          {/* Back to Login */}
          <div className="mt-6 flex justify-center">
            <Link
              to={"/login"}
              className={`flex items-center space-x-2 ${
                darkMode
                  ? "text-indigo-400 hover:text-indigo-300"
                  : "text-indigo-600 hover:text-indigo-500"
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Need help?{" "}
          <a
            href="#"
            className={`font-medium ${
              darkMode
                ? "text-indigo-400 hover:text-indigo-300"
                : "text-indigo-600 hover:text-indigo-500"
            }`}
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
