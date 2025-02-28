import React, { useState } from "react";
import { useSelector } from "react-redux";
import calculateGST from "../utils/calculateGST";

const PaymentPage = () => {
  let { currentCourse } = useSelector((state) => state.course);
  const [addtionalCost, setaddtionalCost] = useState(0);

  return (
    <div className="w-full h-screen bg-[#101828] text-white flex items-center justify-center">
      <div className="w-[70%] h-[60vh] flex gap-10 bg-[#1E2939] rounded-xl px-6 py-10">
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

            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl mb-4 flex items-center justify-center">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
