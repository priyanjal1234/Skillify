import React, { useContext } from "react";
import { ThemeDataContext } from "../context/ThemeContext";

const FormFieldWithoutIcon = ({
  label,
  type = "text",
  placeholder,
  name,
  value,
  handleChange,
  error,
}) => {
  const { darkMode } = useContext(ThemeDataContext);

  return (
    <div className="w-full max-w-md">
      {/* Label */}
      <label
        className={`block text-sm sm:text-base font-medium mb-1 ${
          darkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {label}
      </label>

      {/* Input Field */}
      <div className="relative">
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className={`w-full h-12 px-4 rounded-xl border-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 ${
            darkMode
              ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
              : "border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500"
          }`}
        />
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default FormFieldWithoutIcon;
