import React, { useContext, useEffect, useState } from "react";
import { BookOpen, Sun, Moon } from "lucide-react";
import { ThemeDataContext } from "../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getRandomColor, hslToRgb } from "../utils/generateRandomColor";
import { useQuery } from "@tanstack/react-query";
import chatService from "../services/Chat";
import { toast } from "react-toastify";
import socket from "../socket/socket";
import notificationService from "../services/Notification";
import { setAllNotifications } from "../redux/reducers/NotificationReducer";
import { setLoggedin } from "../redux/reducers/UserReducer";

const Navbar = () => {
  const { darkMode, setDarkMode } = useContext(ThemeDataContext);
  let { isLoggedin, currentUser } = useSelector((state) => state.user);
  const [notificationCount, setNotificationCount] = useState(0);
  const [color, setColor] = useState("");
  let navigate = useNavigate();
  let dispatch = useDispatch();

  useEffect(() => {
    let randomColor = getRandomColor();
    let rgbColor = hslToRgb(
      randomColor.hue,
      randomColor.saturation,
      randomColor.lightness
    );
    setColor(rgbColor);
  }, []);

  useEffect(() => {
    if(currentUser === undefined) {
      setLoggedin(false)
    }
  },[])

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

      return readMessagesRes.data;
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

  let { data: unreadNotifications, refetch: refetchUnreadNotifications } =
    useQuery({
      queryKey: ["fetchUnreadNotifications"],
      queryFn: async function () {
        try {
          let fetchUnreadNotificationsRes =
            await notificationService.getUnreadNotifications();

          setNotificationCount(fetchUnreadNotificationsRes?.data?.length);
          dispatch(setAllNotifications(fetchUnreadNotificationsRes?.data));
          return fetchUnreadNotificationsRes.data;
        } catch (error) {
          console.log(error?.response?.data?.message);
          return false;
        }
      },
    });

  function handleGoLive() {
    const domain = "meet.jit.si";
    const roomName = `Skillify-${currentUser._id}-${Date.now()}`;
    const meetingUrl = `https://${domain}/${roomName}`;
    socket.emit("go-live", {
      instructorId: currentUser?._id,
      meetingUrl,
    });
    refetchUnreadNotifications();
    navigate("/go-live");
  }

  async function handleMarkNotificationsRead() {
    try {
      let res = await notificationService.markAsRead();

      setNotificationCount(0);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
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
                      "https://skillify-frontend-alpha.vercel.app/register/student" ||
                    window.location.href ===
                      "https://skillify-frontend-alpha.vercel.app/login/student" ||
                    window.location.href ===
                      "https://skillify-frontend-alpha.vercel.app/register/instructor" ||
                    window.location.href ===
                      "https://skillify-frontend-alpha.vercel.app/login/instructor"
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
                      "https://skillify-frontend-alpha.vercel.app/register/student" ||
                    window.location.href ===
                      "https://skillify-frontend-alpha.vercel.app/login/student" ||
                    window.location.href ===
                      "https://skillify-frontend-alpha.vercel.app/register/instructor" ||
                    window.location.href ===
                      "https://skillify-frontend-alpha.vercel.app/login/instructor"
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
              currentUser !== undefined && (
                <>
                  <Link
                    to={"/profile"}
                    style={{ backgroundColor: color }}
                    className="w-[40px] h-[40px] cursor-pointer text-lg flex items-center justify-center rounded-full"
                  >
                    {String(currentUser?.name).split("")[0]}
                  </Link>
                  {currentUser?.role !== "instructor" ? (
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
                        Messages
                      </Link>

                      {unreadMessages?.length > 0 && (
                        <span className="w-[25px] h-[25px] flex items-center justify-center bg-blue-600 rounded-full">
                          {unreadMessages?.length}
                        </span>
                      )}

                      <Link
                        onClick={handleMarkNotificationsRead}
                        to={"/notifications"}
                        className={`text-sm font-medium flex items-center gap-2 ${
                          darkMode
                            ? "text-white hover:text-indigo-400"
                            : "text-indigo-600 hover:text-indigo-800"
                        }`}
                      >
                        Notifications
                      </Link>

                      {notificationCount > 0 && (
                        <span className="w-[25px] h-[25px] flex items-center justify-center bg-blue-600 rounded-full">
                          {notificationCount}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleGoLive}
                        className="px-3 py-2 bg-blue-600 rounded-lg"
                      >
                        Go Live
                      </button>
                    </>
                  )}
                  {["priyanjal362@gmail.com"].includes(currentUser?.email) && (
                    <a
                      className="px-3 py-2 bg-gray-600 rounded-lg"
                      href="https://skillify-admin-dashboard.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Admin Panel
                    </a>
                  )}
                </>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
