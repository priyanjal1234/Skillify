import React, { useContext, useEffect, useState } from "react";
import { BookOpen, Sun, Moon } from "lucide-react";
import { ThemeDataContext } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getRandomColor, hslToRgb } from "../utils/generateRandomColor";
import { useQuery } from "@tanstack/react-query";
import chatService from "../services/Chat";
import { toast } from "react-toastify";

const Navbar = () => {
  const { darkMode, setDarkMode } = useContext(ThemeDataContext);
  let { isLoggedin, currentUser } = useSelector((state) => state.user);
  const [color, setcolor] = useState("");

  useEffect(() => {
    let randomColor = getRandomColor();
    let rgbColor = hslToRgb(
      randomColor.hue,
      randomColor.saturation,
      randomColor.lightness
    );
    setcolor(rgbColor);
  }, []);

  let { data: unreadMessages } = useQuery({
    queryKey: ["fetchLoggedinUserUnreadChats"],
    queryFn: async function () {
      try {
        let getUnreadChatsRes = await chatService.getUnreadChats();

        return getUnreadChatsRes.data;
      } catch (error) {
        console.log(error?.response?.data?.message);
        return false;
      }
    },
    enabled: isLoggedin,
  });

  async function handleMessageReadability() {
    try {
      let readMessagesRes = await chatService.readChats(
        unreadMessages?.filteredMessages
      );
    } catch (error) {
      if (
        error?.response?.data?.message ===
        "There are no unread messages available"
      ) {
        return;
      } else {
        toast.error(error?.response?.data?.message);
      }
    }
  }

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
            <Link
              to={"/"}
              className={`ml-2 text-xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Skillify
            </Link>
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

            {isLoggedin === false ? (
              <>
                {/* Sign Up Link */}
                <Link
                  to={"/register/student"}
                  className={`text-sm ${
                    window.location.href ===
                      "http://localhost:5173/register/student" ||
                    window.location.href ===
                      "http://localhost:5173/login/student" ||
                    window.location.href ===
                      "http://localhost:5173/register/instructor" ||
                    window.location.href ===
                      "http://localhost:5173/login/instructor"
                      ? "hidden"
                      : "block"
                  } font-medium ${
                    darkMode
                      ? "text-white hover:text-indigo-400"
                      : "text-indigo-600 hover:text-indigo-800"
                  }`}
                >
                  Sign Up
                </Link>
                {/* Sign in link */}
                <Link
                  to={"/login/student"}
                  className={`text-sm ${
                    window.location.href ===
                      "http://localhost:5173/register/student" ||
                    window.location.href ===
                      "http://localhost:5173/login/student" ||
                    window.location.href ===
                      "http://localhost:5173/register/instructor" ||
                    window.location.href ===
                      "http://localhost:5173/login/instructor"
                      ? "hidden"
                      : "block"
                  } font-medium ${
                    darkMode
                      ? "text-white hover:text-indigo-400"
                      : "text-indigo-600 hover:text-indigo-800"
                  }`}
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={"/profile"}
                  style={{ backgroundColor: color }}
                  className="w-[40px] h-[40px] cursor-pointer  text-lg flex items-center justify-center rounded-full"
                >
                  {String(currentUser?.name).split("")[0]}
                </Link>
                {currentUser?.role !== "instructor" && (
                  <>
                    <Link
                      onClick={handleMessageReadability}
                      to={"/student-messages"}
                      className={`text-sm font-medium flex items-center gap-2 ${
                        darkMode
                          ? "text-white hover:text-indigo-400"
                          : "text-indigo-600 hover:text-indigo-800"
                      }`}
                    >
                      Messages{" "}
                    </Link>

                    {unreadMessages?.length > 0 && (
                      <span className="w-[25px] h-[25px] flex items-center justify-center  bg-blue-600 rounded-full">
                        {unreadMessages?.length}
                      </span>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
