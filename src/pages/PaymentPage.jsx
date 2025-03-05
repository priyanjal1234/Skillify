import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import calculateGST from "../utils/calculateGST";
import { ThemeDataContext } from "../context/ThemeContext";
import { ArrowLeft, Check } from "lucide-react";
import courseService from "../services/Course";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PaymentButton from "../components/PaymentButton";
import { setcurrentCourse } from "../redux/reducers/CourseReducer";
import {
  setDiscountValue,
  setDiscountVisible,
} from "../redux/reducers/CouponReducer";

const PaymentPage = () => {
  let { courseId } = useParams();
  let { darkMode } = useContext(ThemeDataContext);
  let { currentCourse } = useSelector((state) => state.course);
  const [addtionalCost, setaddtionalCost] = useState(0);
  const [code, setcode] = useState("");
  const dispatch = useDispatch();

  let { discountValue, discountVisible } = useSelector((state) => state.coupon);

  const navigate = useNavigate();

  // Fetch current course on mount and whenever courseId or discountVisible changes
  useEffect(() => {
    async function fetchCurrentCourse() {
      try {
        let res = await courseService.getSingleCourse(courseId);
        dispatch(setcurrentCourse(res.data));
      } catch (error) {
        console.error(error?.response?.data?.message);
      }
    }
    fetchCurrentCourse();
  }, [courseId, discountVisible, dispatch]);

  async function handleGoBack() {
    const userConfirmed = window.confirm(
      "Are you sure you want to leave this page?\n\nClick OK to leave (your enrollment will be removed), or Cancel to stay."
    );

    if (userConfirmed) {
      dispatch(setDiscountValue(0));
      dispatch(setDiscountVisible(false));
      try {
        await courseService.unenrollFromCourse(courseId);
        navigate(`/course/${courseId}`);
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    }
  }

  async function handleApplyCouponCode() {
    try {
      let applyCouponRes = await courseService.applyCouponCode(code, courseId);
      toast.success("Coupon Applied Successfully");

      // Sanitize discount value: if it contains "%", remove it, then convert to number.
      let discount = applyCouponRes.data.discountValue;
      if (typeof discount === "string") {
        discount = discount.replace("%", "");
      }
      discount = Number(discount);

      dispatch(setDiscountVisible(true));
      dispatch(setDiscountValue(discount));
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  const basePrice = Number(currentCourse?.price) || 0;
  const gst = Number(calculateGST(basePrice)) || 0;
  const totalBeforeDiscount = basePrice + gst;
  const totalAfterDiscount = totalBeforeDiscount - discountValue;

  const finalAmount = Math.round(
    discountVisible ? totalAfterDiscount : totalBeforeDiscount
  );

  return (
    <div className="w-full h-screen bg-[#101828] text-white flex items-center justify-center">
      <div className="w-[70%] h-fit relative flex gap-10 bg-[#1E2939] rounded-xl px-6 py-10">
        <div onClick={handleGoBack} className="cursor-pointer">
          <ArrowLeft />
        </div>
        <div className="w-[60%] h-full">
          <h1 className="text-2xl font-semibold mb-10">Your Course</h1>
          <div className="w-full h-[50%] flex gap-4 bg-[#2c394d] rounded-lg p-4">
            <div className="w-[35%] h-full rounded-lg overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={
                  currentCourse?.thumbnail ||
                  "https://cdn.pixabay.com/photo/2018/02/27/10/49/training-3185170_1280.jpg"
                }
                alt="Course Thumbnail"
              />
            </div>
            <div>
              <h1 className="text-2xl font-medium">{currentCourse?.title}</h1>
              <h2 className="text-xl">₹ {basePrice}</h2>

              {/* Only show coupon input if discount hasn't been applied */}
              {currentCourse?.couponCode && !discountVisible && (
                <>
                  <h2>Use code {currentCourse?.couponCode} to get discount</h2>
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="text"
                      name="code"
                      value={code}
                      onChange={(e) => setcode(e.target.value)}
                      placeholder="Enter Coupon Code"
                      className="p-2 rounded-md bg-[#1E2939] text-white"
                    />
                    <button
                      onClick={handleApplyCouponCode}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                      Apply
                    </button>
                  </div>
                </>
              )}
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
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
              <div className="flex items-center space-x-2">
                <Check className="text-green-500" />
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Contact Us:&nbsp;
                  <a
                    href="mailto:hello@skillify.com"
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
        <div className="w-[40%] h-fit">
          <h1 className="text-3xl mb-10">Payment Details</h1>
          <div className="w-full h-full bg-[#2C394D] rounded-lg p-6">
            <h2 className="flex w-full justify-between text-xl mb-4">
              <span>Base Amount</span>
              <span className="font-semibold">₹ {basePrice}</span>
            </h2>
            <h2 className="flex w-full justify-between text-xl mb-4">
              <span>GST (18%)</span>
              <span>₹ {gst}</span>
            </h2>
            <h2 className="flex w-full justify-between text-xl">
              <span>Additional Cost</span>
              <span>₹ {addtionalCost}</span>
            </h2>
            <hr className="mt-8 mb-4 border-gray-500" />
            <h2 className="flex w-full justify-between text-xl mb-4">
              <span>Total Amount</span>
              <span>₹ {totalBeforeDiscount}</span>
            </h2>
            {discountVisible && (
              <>
                <h2 className="flex w-full justify-between text-xl mb-4">
                  <span className="text-green-600">Discount Applied</span>
                  <span>- ₹ {discountValue}</span>
                </h2>
                <h2 className="flex w-full justify-between text-xl mb-4">
                  <span>Discounted Price</span>
                  <span>₹ {totalAfterDiscount}</span>
                </h2>
              </>
            )}
            <PaymentButton
              courseId={courseId}
              amount={finalAmount}
              instructor={currentCourse?.instructor}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
