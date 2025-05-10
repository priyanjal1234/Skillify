import React, { useContext, useState } from "react";
import { Mail, TimerReset as KeyReset, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import FormField from "../components/FormField";
import { ThemeDataContext } from "../context/ThemeContext";
import forgotPasswordSchema from "../schemas/forgotPasswordSchema";
import { z } from "zod";
import userService from "../services/User";
import { toast } from "react-toastify";
import SubmitBtn from "../components/SubmitBtn";

const ForgotPassword = () => {
  const { darkMode } = useContext(ThemeDataContext);
  const [error, seterror] = useState("");
  const [loading, setloading] = useState(false);

  const [email, setemail] = useState("");

  let navigate = useNavigate();

  function handleChange(e) {
    let newEmail = e.target.value;
    setemail(newEmail);

    try {
      forgotPasswordSchema.pick({ email: true }).parse({ email: newEmail });
      seterror("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        seterror(error.errors[0].message);
      }
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault();

    setloading(true);

    try {
      await userService.forgotPassword(email);
      setloading(false);
      toast.success("Check Your Email for Password Reset OTP");
      navigate("/verify-otp")
    } catch (error) {
      setloading(false);
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <div
      className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center transition duration-300 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-indigo-100 to-purple-100 text-gray-900"
      }`}
    >
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div
              className={`p-3 rounded-full shadow-lg transition duration-300 ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <KeyReset
                className={`h-10 w-10 transition duration-300 ${
                  darkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              />
            </div>
          </div>
          <h2 className="text-4xl font-extrabold mb-2 transition duration-300">
            Enter your Email
          </h2>
        </div>

        <div
          className={`py-8 px-10 shadow-2xl rounded-2xl transition duration-300 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <FormField
              label="Email Address"
              icon={Mail}
              type="email"
              placeholder="you@example.com"
              name="email"
              value={email}
              handleChange={handleChange}
              error={error}
            />

            <div>
              <SubmitBtn btnText="Get OTP" loading={loading} />
            </div>
          </form>

          <div className="mt-8 flex justify-center">
            <Link
              to={"/login/student"}
              className={`flex items-center space-x-2 transition duration-300 ${
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

        <div className="mt-6 text-center text-sm transition duration-300">
          Remember your password?{" "}
          <Link
            to={"/login"}
            className={`font-medium transition duration-300 ${
              darkMode
                ? "text-indigo-400 hover:text-indigo-300"
                : "text-indigo-600 hover:text-indigo-500"
            }`}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;