import React, { useContext } from "react";
import { ThemeDataContext } from "../context/ThemeContext";

const FormField = ({
  label,
  icon: Icon,
  type,
  placeholder,
  name,
  value,
  handleChange,
  error
}) => {
  const { darkMode } = useContext(ThemeDataContext);
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-3.5 h-5 w-5 text-indigo-500" />
        <input
          type={type}
          required
          className={`pl-10 w-full h-12 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
            darkMode
              ? "border-gray-600 bg-gray-700 text-white"
              : "border-gray-200 bg-gray-50 text-gray-800"
          }`}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
        />
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default FormField;
