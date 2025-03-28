import { CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import React, { useContext, useState } from "react";
import { ThemeDataContext } from "../context/ThemeContext";
import useFormHandler from "../hooks/useFormHandler";
import verifyEmailSchema from "../schemas/verifyEmailSchema";
import FormField from "../components/FormField";
import SubmitBtn from "../components/SubmitBtn";
import { toast } from "react-toastify";
import userService from "../services/User";
import { useDispatch } from "react-redux";
import { setLoggedin } from "../redux/reducers/UserReducer";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const { darkMode } = useContext(ThemeDataContext);
  const [loading, setLoading] = useState(false);

  let dispatch = useDispatch();
  let navigate = useNavigate();

  const { values, handleChange, errors } = useFormHandler(
    { email: "", verificationCode: "" },
    verifyEmailSchema
  );

  async function handleEmailVerification(e) {
    e.preventDefault();

    setLoading(true);

    const parsedData = verifyEmailSchema.safeParse(values);
    if (!parsedData.success) {
      setLoading(false);
      const firstError = parsedData.error.issues[0]?.message;
      toast.error(firstError);
      return;
    }

    try {
      await userService.verifyEmail(values);
      toast.success("Email Verified Successfully");
      setLoading(false);
      dispatch(setLoggedin(true));
      navigate("/");
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message);
    }
  }

  async function handleResendCode() {
    try {
      await userService.resendCode(values.email);
      toast.success("Check Your Email For Verification Code");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-indigo-100 to-purple-100 text-gray-900"
      }`}
    >
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div
              className={`p-3 rounded-full shadow-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <CheckCircle2
                className={`h-12 w-12 ${
                  darkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              />
            </div>
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-extrabold">
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm sm:text-base">
            We've sent a verification code to your email
          </p>
        </div>

        <div
          className={`p-6 sm:p-8 md:p-10 shadow-2xl rounded-xl ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
        >
          <form onSubmit={handleEmailVerification} className="space-y-6">
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
              label="Verification Code"
              icon={ShieldCheck}
              type="number"
              placeholder="Enter Code"
              name="verificationCode"
              value={values.verificationCode}
              handleChange={handleChange}
              error={errors.verificationCode}
            />

            <SubmitBtn btnText="Verify Email" loading={loading} />
          </form>

          <div className="mt-6 text-center">
            <button
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
              onClick={handleResendCode}
            >
              Didn't receive the code? Resend
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm">
          Having trouble?{" "}
          <a href="#" className="text-indigo-600 hover:text-indigo-500">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
