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
  const [loading, setloading] = useState(false)

  let dispatch = useDispatch();
  let navigate = useNavigate();

  const { values, handleChange, errors } = useFormHandler(
    { email: "", otp: "" },
    verifyOTPSchema
  );

  async function handleOTPVerification(e) {
    e.preventDefault();

    setloading(true)

    const parsedData = verifyOTPSchema.safeParse(values);
    if (!parsedData.success) {
      setloading(false)
      const firstError = parsedData.error.issues[0]?.message;
      toast.error(firstError);
      return;
    }

    try {
      await userService.verifyOTP(values);
      toast.success("You are verified to reset your password");
      setloading(false)
      navigate("/reset-password");
    } catch (error) {
      setloading(false)
      toast.error(error?.response?.data?.message);
    }
  }

  

  return (
    <div
      className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-indigo-100 to-purple-100 text-gray-900"
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
              <CheckCircle2
                className={`h-10 w-10 ${
                  darkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              />
            </div>
          </div>
          <h2 className="text-4xl font-extrabold mb-2">Enter OTP for Password Reset</h2>
          
        </div>

        <div
          className={`py-8 px-10 shadow-2xl rounded-2xl ${
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
              placeholder="Enter 6 digit OTP"
              name="otp"
              value={values.otp}
              handleChange={handleChange}
              error={errors.otp}
            />

            <div>
              <SubmitBtn btnText="Verify OTP" loading={loading} />
            </div>
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