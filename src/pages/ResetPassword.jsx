import { ArrowLeft, Lock, Shield } from "lucide-react";
import React, { useState, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormField from "../components/FormField";
import resetPasswordSchema from "../schemas/resetPasswordSchema";
import { z } from "zod";
import { ThemeDataContext } from "../context/ThemeContext"; // Assuming dark mode is stored in a context
import SubmitBtn from "../components/SubmitBtn";
import userService from "../services/User";
import { toast } from "react-toastify";

const ResetPassword = () => {
  let { token } = useParams();
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { darkMode } = useContext(ThemeDataContext);

  let navigate = useNavigate();

  function handleChange(e) {
    let newPassword = e.target.value;
    setPassword(newPassword);

    try {
      resetPasswordSchema
        .pick({ password: true })
        .parse({ password: newPassword });
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
      const parsedData = resetPasswordSchema.parse({ password });
  
      await userService.resetPassword(password, token);
      toast.success("Password Reset Successfully");
      navigate("/login/student");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0]?.message;
        toast.error(firstError);
      } else {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    }
  }
  
  return (
    <div
      className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-indigo-100 to-purple-100"
      }`}
    >
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
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
          <h2 className="text-4xl font-extrabold mb-2">Set New Password</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Choose a strong password for your account
          </p>
        </div>

        <div
          className={`py-8 px-10 shadow-2xl rounded-2xl ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <form onSubmit={handleResetPassword} className="space-y-6">
            <FormField
              label="New Password"
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              name="password"
              value={password}
              handleChange={handleChange}
              error={error}
            />

            <div>
              <SubmitBtn btnText="Reset Password" loading={loading} />
            </div>
          </form>

          <div className="mt-8 flex justify-center">
            <Link
              to="/login"
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
