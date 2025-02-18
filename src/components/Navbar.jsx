import React, { useContext } from "react";
import { BookOpen,Sun,Moon } from "lucide-react";
import { ThemeDataContext } from "../context/ThemeContext";

const Navbar = () => {
  const {darkMode,setDarkMode} = useContext(ThemeDataContext)
  return (
    <nav className={`shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <BookOpen
              className={`h-8 w-8 ${
                darkMode ? "text-indigo-400" : "text-indigo-600"
              }`}
            />
            <span
              className={`ml-2 text-xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Skillify
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
