import React, { useState } from "react";
import orderService from "../services/Order";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setDiscountValue,
  setDiscountVisible,
} from "../redux/reducers/CouponReducer";

const PaymentButton = ({ courseId, amount, instructor }) => {
  let { currentUser } = useSelector((state) => state.user);
  let { currentCourse } = useSelector((state) => state.course);

  let dispatch = useDispatch();

  let navigate = useNavigate();
  async function handlePayment() {
    try {
      const { data } = await orderService.createOrder(
        amount,
        courseId,
        instructor
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "Skillify",
        description: "Pay karo tabhi milega course",
        order_id: data.order.id,
        handler: async function (response) {
          let newResponse = { ...response };
          newResponse.instructor = currentCourse?.instructor;
          try {
            const verifyRes = await orderService.verifyPayment(
              newResponse,
              courseId
            );
            if (verifyRes.data.success) {
              toast.success("Payment Successfull");
              dispatch(setDiscountValue(0));
              dispatch(setDiscountVisible(false));
              navigate(`/course/${courseId}`);
            } else {
              toast.error("Payment Failed. Try again after some time. Your amount has not been deducted")
              
            }
          } catch (error) {
            toast.error("Payment verification failed!");
          }
        },
        prefill: {
          name: currentUser?.name,
          email: currentUser?.email,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl mb-4 flex items-center justify-center"
    >
      Proceed to Checkout
    </button>
  );
};

export default PaymentButton;
