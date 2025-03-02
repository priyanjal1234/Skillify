import { BookOpen } from "lucide-react";
import React, { useContext } from "react";
import { ThemeDataContext } from "../context/ThemeContext";

const AnalyticCard = ({
  heading ,
  icon: Icon,
  value,
}) => {
  const { darkMode } = useContext(ThemeDataContext);

  return (
    <div
      className={`
        ${darkMode ? "bg-gray-800" : "bg-white"}
        p-6 rounded-xl shadow-sm
        w-full sm:w-96
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          {heading}
        </h3>
        <Icon
          className={`h-6 w-6 ${
            darkMode ? "text-indigo-400" : "text-indigo-600"
          }`}
        />
      </div>
      <p
        className={`text-3xl font-bold ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {value}
      </p>
      <p
        className={`mt-2 text-sm ${
          darkMode ? "text-green-400" : "text-green-600"
        }`}
      >
        ↑ 2 this month
      </p>
    </div>
  );
};

export default AnalyticCard;
