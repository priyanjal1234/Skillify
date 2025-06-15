import React, { useContext, useEffect, useState } from "react";
import { BookOpen, Sun, Moon, Menu, X } from "lucide-react";
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
import { setCurrentUser, setLoggedin } from "../redux/reducers/UserReducer";
import userService from "../services/User";

const Navbar = () => {
  const { darkMode, setDarkMode } = useContext(ThemeDataContext);
  let { isLoggedin, currentUser } = useSelector((state) => state.user);
  const [notificationCount, setNotificationCount] = useState(0);
  const [color, setColor] = useState("#4f46e5");
  const [menuOpen, setMenuOpen] = useState(false);
  let navigate = useNavigate();
  let dispatch = useDispatch();

  /* ---------------- Helpers ---------------- */
  useEffect(() => {
    let randomColor = getRandomColor();
    let rgbColor = hslToRgb(
      randomColor.hue,
      randomColor.saturation,
      randomColor.lightness
    );
    setColor(rgbColor);
  }, []);

  /* ---------------- Queries ---------------- */
  useQuery({
    queryKey: ["getGoogleUser"],
    queryFn: async () => {
      try {
        const res = await userService.getGoogleUser();
        if (res.data) dispatch(setLoggedin(true));
        return res.data;
      } catch {
        return {};
      }
    },
  });

  let { data: unreadMessages } = useQuery({
    queryKey: ["fetchLoggedinUserUnreadChats"],
    queryFn: async () => {
      try {
        let getUnreadChatsRes = await chatService.getUnreadChats();
        return getUnreadChatsRes.data;
      } catch {
        return false;
      }
    },
    enabled: isLoggedin,
  });

  async function handleMessageReadability() {
    try {
      await chatService.readChats(unreadMessages?.filteredMessages);
    } catch (error) {
      if (
        error?.response?.data?.message !==
        "There are no unread messages available"
      ) {
        toast.error(error?.response?.data?.message);
      }
    }
  }

  let { data: unreadNotifications, refetch: refetchUnreadNotifications } =
    useQuery({
      queryKey: ["fetchUnreadNotifications"],
      queryFn: async () => {
        try {
          let fetchUnreadNotificationsRes =
            await notificationService.getUnreadNotifications();

          setNotificationCount(fetchUnreadNotificationsRes?.data?.length || 0);
          dispatch(setAllNotifications(fetchUnreadNotificationsRes?.data));
          return fetchUnreadNotificationsRes.data;
        } catch {
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
      await notificationService.markAsRead();
      setNotificationCount(0);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  }

  /* ---------------- Render Helpers ---------------- */
  const NavLinks = () => (
    <>
      {isLoggedin === false ? (
        <>
          {/* ---------- Auth Links ---------- */}
          <Link
            to={"/register/student"}
            className={`text-sm font-medium ${
              darkMode
                ? "text-white hover:text-indigo-400"
                : "text-indigo-600 hover:text-indigo-800"
            }`}
          >
            Sign Up
          </Link>
          <Link
            to={"/login/student"}
            className={`text-sm font-medium ${
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
            className="w-10 h-10 cursor-pointer text-lg flex items-center justify-center rounded-full"
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
                <span className="w-6 h-6 flex items-center justify-center bg-blue-600 rounded-full text-xs">
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
                <span className="w-6 h-6 flex items-center justify-center bg-blue-600 rounded-full text-xs">
                  {notificationCount}
                </span>
              )}
            </>
          ) : (
            <button
              onClick={handleGoLive}
              className="px-3 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors"
            >
              Go Live
            </button>
          )}

          {[
            "priyanjal362@gmail.com", // <-- add more admin emails here
          ].includes(currentUser?.email) && (
            <a
              className="px-3 py-2 bg-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors"
              href="https://skillify-admin-dashboard.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Admin Panel
            </a>
          )}
        </>
      )}
    </>
  );

  return (
    <header
      className={`shadow-lg sticky top-0 z-50 ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* ---------- Brand ---------- */}
        <div className="flex items-center gap-2">
          <BookOpen
            className={`h-8 w-8 ${
              darkMode ? "text-indigo-400" : "text-indigo-600"
            }`}
          />
          <Link
            to={"/"}
            className={`text-xl font-bold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Skillify
          </Link>
        </div>

        {/* ---------- Desktop Links ---------- */}
        <nav className="hidden md:flex items-center space-x-4">
          <NavLinks />
          {/* Theme Toggle */}
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
        </nav>

        {/* ---------- Mobile Controls ---------- */}
        <div className="md:hidden flex items-center gap-2">
          {/* Theme Toggle on Mobile */}
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
          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg transition-colors duration-200 focus:outline-none"
          >
            {menuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* ---------- Mobile Menu ---------- */}
      <nav
        className={`${
          menuOpen ? "block" : "hidden"
        } md:hidden border-t border-gray-200 dark:border-gray-700 px-6 py-4 space-y-4 bg-white dark:bg-gray-800`}
      >
        <NavLinks />
      </nav>
    </header>
  );
};

export default Navbar;