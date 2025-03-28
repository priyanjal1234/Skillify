import { CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import React, { useContext, useState } from "react";
import { ThemeDataContext } from "../context/ThemeContext";
import useFormHandler from "../hooks/useFormHandler";
import verifyOTPSchema from "../schemas/verifyOTPSchema";
import FormField from "../components/FormField";
import SubmitBtn from "../components/SubmitBtn";
import { toast } from "react-toastify";
import userService from "../services/User";
import { useDispatch } from "react-redux";
import { setLoggedin } from "../redux/reducers/UserReducer";
import { useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const { darkMode } = useContext(ThemeDataContext);
  const [loading, setLoading] = useState(false);

  let dispatch = useDispatch();
  let navigate = useNavigate();

  const { values, handleChange, errors } = useFormHandler(
    { email: "", otp: "" },
    verifyOTPSchema
  );

  async function handleOTPVerification(e) {
    e.preventDefault();

    setLoading(true);

    const parsedData = verifyOTPSchema.safeParse(values);
    if (!parsedData.success) {
      setLoading(false);
      const firstError = parsedData.error.issues[0]?.message;
      toast.error(firstError);
      return;
    }

    try {
      await userService.verifyOTP(values);
      toast.success("You are verified to reset your password");
      setLoading(false);
      navigate("/reset-password");
    } catch (error) {
      setLoading(false);
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
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
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
            Enter OTP for Password Reset
          </h2>
        </div>

        <div
          className={`p-6 sm:p-8 md:p-10 shadow-2xl rounded-xl ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
        >
          <form onSubmit={handleOTPVerification} className="space-y-6">
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
              label="OTP"
              icon={ShieldCheck}
              type="number"
              placeholder="Enter 6-digit OTP"
              name="otp"
              value={values.otp}
              handleChange={handleChange}
              error={errors.otp}
            />

            <SubmitBtn btnText="Verify OTP" loading={loading} />
          </form>
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

export default VerifyOTP;
