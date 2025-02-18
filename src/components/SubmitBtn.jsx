import React from "react";

const SubmitBtn = ({btnText}) => {
  return (
    <div>
      <button
        type="submit"
        className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg transition duration-200"
      >
        {btnText}
      </button>
    </div>
  );
};

export default SubmitBtn;
