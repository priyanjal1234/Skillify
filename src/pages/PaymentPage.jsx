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
    <div className="w-full min-h-screen bg-[#101828] text-white flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-5xl flex flex-col sm:flex-row gap-6 bg-[#1E2939] rounded-xl p-6 sm:p-10">
        {/* Back Button */}
        <div onClick={handleGoBack} className="cursor-pointer">
          <ArrowLeft />
        </div>

        {/* Course Details Section */}
        <div className="w-full sm:w-[60%]">
          <h1 className="text-2xl font-semibold mb-6 sm:mb-10">Your Course</h1>
          <div className="w-full flex flex-col sm:flex-row gap-4 bg-[#2c394d] rounded-lg p-4">
            <div className="w-full sm:w-[35%] rounded-lg overflow-hidden">
              <img
                className="w-full h-40 sm:h-full object-cover"
                src={
                  currentCourse?.thumbnail ||
                  "https://cdn.pixabay.com/photo/2018/02/27/10/49/training-3185170_1280.jpg"
                }
                alt="Course Thumbnail"
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-medium">
                {currentCourse?.title}
              </h1>
              <h2 className="text-lg sm:text-xl">₹ {basePrice}</h2>

              {/* Coupon Input */}
              {currentCourse?.couponCode && !discountVisible && (
                <>
                  <h2 className="text-sm sm:text-md">
                    Use code {currentCourse?.couponCode} to get discount
                  </h2>
                  <div className="mt-3 flex flex-col sm:flex-row items-center gap-2">
                    <input
                      type="text"
                      name="code"
                      value={code}
                      onChange={(e) => setcode(e.target.value)}
                      placeholder="Enter Coupon Code"
                      className="p-2 rounded-md bg-[#1E2939] text-white w-full sm:w-auto"
                    />
                    <button
                      onClick={handleApplyCouponCode}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md w-full sm:w-auto"
                    >
                      Apply
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Payment Details Section */}
        <div className="w-full sm:w-[40%]">
          <h1 className="text-2xl sm:text-3xl mb-6 sm:mb-10">Payment Details</h1>
          <div className="w-full bg-[#2C394D] rounded-lg p-6">
            <h2 className="flex w-full justify-between text-lg sm:text-xl mb-4">
              <span>Base Amount</span>
              <span className="font-semibold">₹ {basePrice}</span>
            </h2>
            <h2 className="flex w-full justify-between text-lg sm:text-xl mb-4">
              <span>GST (18%)</span>
              <span>₹ {gst}</span>
            </h2>
            <h2 className="flex w-full justify-between text-lg sm:text-xl">
              <span>Additional Cost</span>
              <span>₹ {addtionalCost}</span>
            </h2>
            <hr className="mt-8 mb-4 border-gray-500" />
            <h2 className="flex w-full justify-between text-lg sm:text-xl mb-4">
              <span>Total Amount</span>
              <span>₹ {totalBeforeDiscount}</span>
            </h2>
            {discountVisible && (
              <>
                <h2 className="flex w-full justify-between text-lg sm:text-xl mb-4 text-green-600">
                  <span>Discount Applied</span>
                  <span>- ₹ {discountValue}</span>
                </h2>
                <h2 className="flex w-full justify-between text-lg sm:text-xl mb-4">
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
