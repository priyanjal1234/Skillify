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

const Navbar = () => {
  const { darkMode, setDarkMode } = useContext(ThemeDataContext);
  let { isLoggedin, currentUser } = useSelector((state) => state.user);
  const [notificationCount, setnotificationCount] = useState(0);
  const [color, setcolor] = useState("");
  const [menuOpen, setMenuOpen] = useState(false); // For mobile menu toggle
  let navigate = useNavigate();
  let dispatch = useDispatch();

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

          setnotificationCount(fetchUnreadNotificationsRes?.data?.length);
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
      setnotificationCount(0);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  }

  return (
    <nav className={`shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"} p-4`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <BookOpen className={`h-8 w-8 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
          <Link to={"/"} className={`ml-2 text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
            Skillify
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {darkMode ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-gray-600" />}
          </button>

          {!isLoggedin ? (
            <>
              <Link to={"/register/student"} className="text-sm text-indigo-600 hover:text-indigo-800">
                Sign Up
              </Link>
              <Link to={"/login/student"} className="text-sm text-indigo-600 hover:text-indigo-800">
                Login
              </Link>
            </>
          ) : (
            <>
              <Link to={"/profile"} style={{ backgroundColor: color }} className="w-[40px] h-[40px] cursor-pointer text-lg flex items-center justify-center rounded-full">
                {String(currentUser?.name).charAt(0)}
              </Link>
              {currentUser?.role !== "instructor" ? (
                <>
                  <Link onClick={handleMessageReadability} to={"/student-messages"} className="text-sm text-indigo-600 hover:text-indigo-800">
                    Messages {unreadMessages?.length > 0 && <span className="ml-1 text-red-500">({unreadMessages?.length})</span>}
                  </Link>
                  <Link onClick={handleMarkNotificationsRead} to={"/notifications"} className="text-sm text-indigo-600 hover:text-indigo-800">
                    Notifications {notificationCount > 0 && <span className="ml-1 text-red-500">({notificationCount})</span>}
                  </Link>
                </>
              ) : (
                <button onClick={handleGoLive} className="px-3 py-2 bg-blue-600 rounded-lg text-white">
                  Go Live
                </button>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button (only visible if not logged in) */}
        {!isLoggedin && (
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        )}

        {/* Profile for logged-in users in mobile view */}
        {isLoggedin && (
          <Link to={"/profile"} style={{ backgroundColor: color }} className="md:hidden w-[40px] h-[40px] cursor-pointer text-lg flex items-center justify-center rounded-full">
            {String(currentUser?.name).charAt(0)}
          </Link>
        )}
      </div>

      {/* Mobile Menu (Only visible if user is not logged in) */}
      {menuOpen && !isLoggedin && (
        <div className="md:hidden flex flex-col items-center space-y-4 mt-4">
          <Link to={"/register/student"} className="text-sm text-indigo-600 hover:text-indigo-800">
            Sign Up
          </Link>
          <Link to={"/login/student"} className="text-sm text-indigo-600 hover:text-indigo-800">
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
