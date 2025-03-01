import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import calculateGST from "../utils/calculateGST";
import { ThemeDataContext } from "../context/ThemeContext";
import { ArrowLeft, Check } from "lucide-react";
import courseService from "../services/Course";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PaymentButton from "../components/PaymentButton";

const PaymentPage = () => {
  let { courseId } = useParams();
  let { darkMode } = useContext(ThemeDataContext);
  let { currentCourse } = useSelector((state) => state.course);
  const [addtionalCost, setaddtionalCost] = useState(0);
  let navigate = useNavigate();

  async function handleGoBack() {
    const userConfirmed = window.confirm(
      "Are you sure you want to leave this page?\n\nClick OK to leave (your enrollment will be removed), or Cancel to stay."
    );

    if (userConfirmed) {
      try {
        await courseService.unenrollFromCourse(courseId);

        navigate(`/course/${courseId}`);
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    }
  }

  return (
    <div className="w-full h-screen bg-[#101828] text-white flex items-center justify-center">
      <div className="w-[70%] h-[60vh] relative flex gap-10 bg-[#1E2939] rounded-xl px-6 py-10">
        <div onClick={handleGoBack} className="cursor-pointer">
          <ArrowLeft />
        </div>
        <div className="w-[60%] h-full">
          <h1 className="text-2xl font-semibold mb-10">Your Course</h1>
          <div className="w-full h-[50%] flex  gap-4 bg-[#2c394d] rounded-lg p-4">
            <div className="w-[35%] h-full rounded-lg overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={
                  currentCourse?.thumbnail
                    ? currentCourse?.thumbnail
                    : "https://cdn.pixabay.com/photo/2018/02/27/10/49/training-3185170_1280.jpg"
                }
                alt=""
              />
            </div>
            <div>
              <h1 className="text-2xl font-medium">{currentCourse?.title}</h1>
              <h2 className="text-xl">₹ {currentCourse?.price}</h2>
            </div>
          </div>
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-lg p-6 mb-8`}
          >
            <h2
              className={`text-xl font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Payment &amp; Support Info
            </h2>

            {/* Container holding the three items */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              {/* 3-Days Refund Policy */}
              <div className="flex items-center space-x-2">
                <Check className="text-green-500" />
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  3-Days Refund Policy
                </span>
              </div>

              {/* Contact Us */}
              <div className="flex items-center space-x-2">
                <Check className="text-green-500" />
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Contact Us:&nbsp;
                  <a
                    href="mailto:hello@shreyjans.com"
                    className={`underline ${
                      darkMode
                        ? "text-indigo-400 hover:text-indigo-500"
                        : "text-indigo-600 hover:text-indigo-500"
                    }`}
                  >
                    hello@skillify.com
                  </a>
                </span>
              </div>

              {/* Course Completion Certificate */}
              <div className="flex items-center space-x-2">
                <Check className="text-green-500" />
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Get Course Completion Certificate
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[40%] h-[80%] ">
          <h1 className="text-3xl mb-10">Payment Details</h1>
          <div className="w-full h-full bg-[#2C394D] rounded-lg p-6">
            <h2 className="flex w-full justify-between text-xl mb-4">
              <span>Base Amount</span>
              <span className="font-semibold">₹ {currentCourse?.price}</span>
            </h2>
            <h2 className="flex w-full justify-between text-xl mb-4">
              <span>GST (18%)</span>{" "}
              <span>₹ {calculateGST(currentCourse?.price)}</span>
            </h2>
            <h2 className="flex w-full justify-between text-xl">
              <span>Addtional Cost</span>
              <span>₹ {addtionalCost}</span>
            </h2>
            <hr className="mt-8 mb-4 border-gray-500" />
            <h2 className="flex w-full justify-between text-xl mb-4">
              <span>Total Amount</span>{" "}
              <span>
                ₹ {currentCourse?.price + calculateGST(currentCourse?.price)}
              </span>{" "}
            </h2>

            <PaymentButton
              courseId={courseId}
              amount={currentCourse?.price + calculateGST(currentCourse?.price)}
              instructor = {currentCourse?.instructor}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
