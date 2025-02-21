import React from "react";

const SubmitBtn = ({ loading, btnText }) => {
  return (
    <div>
      <button
        type="submit"
        className="w-full h-12 flex gap-3 items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition duration-200 transform hover:-translate-y-0.5"
      >
        {btnText}

        {loading && <span class="loader"></span>}
      </button>
    </div>
  );
};

export default SubmitBtn;
