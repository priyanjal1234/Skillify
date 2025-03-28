import { BookOpen } from "lucide-react";
import React, { useContext } from "react";
import { ThemeDataContext } from "../context/ThemeContext";

const AnalyticCard = ({ heading, icon: Icon, value }) => {
  const { darkMode } = useContext(ThemeDataContext);

  return (
    <div
      className={`
        ${darkMode ? "bg-gray-800" : "bg-white"}
        p-6 rounded-xl shadow-sm w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg
        flex flex-col justify-between transition-all
      `}
    >
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-sm sm:text-base`}>
          {heading}
        </h3>
        <Icon
          className={`h-6 w-6 ${
            darkMode ? "text-indigo-400" : "text-indigo-600"
          }`}
        />
      </div>

      {/* Value Display */}
      <p
        className={`text-2xl sm:text-3xl font-bold ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {value}
      </p>

      {/* Growth Indicator */}
      <p
        className={`mt-2 text-xs sm:text-sm ${
          darkMode ? "text-green-400" : "text-green-600"
        }`}
      >
        ↑ 2 this month
      </p>
    </div>
  );
};

export default AnalyticCard;
