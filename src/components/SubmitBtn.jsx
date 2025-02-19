import React from "react";

const SubmitBtn = ({ loading,btnText }) => {
  return (
    <div>
      <button
        type="submit"
        className="w-full h-12 bg-indigo-600 flex items-center justify-center gap-3.5 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg transition duration-200"
      >
        {btnText}

        {loading && <div className="loader"></div>}
      </button>
    </div>
  );
};

export default SubmitBtn;
