import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Mail, MapPin, Calendar, User, LogOut, Edit } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import convertToRealDate from "../utils/createdAtConversion";
import userService from "../services/User";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { setCurrentUser, setLoggedin } from "../redux/reducers/UserReducer";
import { ThemeDataContext } from "../context/ThemeContext";
import { getUserLocation } from "../utils/getUserLocation";
import { getAddressFromCoordinates } from "../utils/convertToRealLocation";
import {
  setReceiverChats,
  setSenderChats,
} from "../redux/reducers/ChatReducer";
import {
  setDiscountValue,
  setDiscountVisible,
} from "../redux/reducers/CouponReducer";
import {
  setAllCourses,
  setcurrentCourse,
  setInstructorCourses,
} from "../redux/reducers/CourseReducer";
import { setEnrolledStudents } from "../redux/reducers/EnrollmentReducer";
import {
  setTotalCourses,
  setTotalRevenue,
  setTotalStudents,
} from "../redux/reducers/InstructorReducer";
import { setCurrentQuiz } from "../redux/reducers/QuizReducer";

const Profile = () => {
  let { currentUser } = useSelector((state) => state.user);
  let { darkMode } = useContext(ThemeDataContext);
  const [location, setlocation] = useState("");
  const [loading, setloading] = useState(false)

  useEffect(() => {
    async function fetchLocation() {
      try {
        let { latitude, longitude } = await getUserLocation();
        let { address } = await getAddressFromCoordinates(latitude, longitude);
        setlocation(address);
      } catch (error) {
        setlocation("No Location");
      }
    }

    fetchLocation();
  }, []);

  let dispatch = useDispatch();
  let navigate = useNavigate();

  async function handleLogout() {
    setloading(true)
    try {
      await userService.logoutAccount();
      toast.success("Logout Success");
      dispatch(setLoggedin(false));
      dispatch(setCurrentUser(null));
      dispatch(setSenderChats([]));
      dispatch(setReceiverChats([]));
      dispatch(setDiscountVisible(false));
      dispatch(setDiscountValue(0));
      dispatch(setAllCourses([]));
      dispatch(setInstructorCourses([]));
      dispatch(setcurrentCourse({}));
      dispatch(setEnrolledStudents([]));
      dispatch(setTotalCourses([]));
      dispatch(setTotalStudents(0));
      dispatch(setTotalRevenue(0));
      dispatch(setCurrentQuiz({}));
      
      setloading(false)
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <Navbar />

      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-2xl shadow-xl overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            {/* Header/Cover Image */}
            <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>

            {/* Profile Content */}
            <div className="relative px-4 sm:px-6 lg:px-8 pb-8">
              {/* Avatar */}
              <div className="relative -mt-16 flex justify-center">
                <img
                  src={currentUser?.profileImage}
                  alt="Profile"
                  className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-gray-800"
                />
              </div>

              <div className="text-center mt-4">
                <h1 className="text-2xl sm:text-3xl font-bold">{currentUser?.name}</h1>
              </div>

              {/* Details Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-indigo-500" />
                    <span className="text-sm sm:text-base">{currentUser?.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-indigo-500" />
                    <span className="text-sm sm:text-base">{location}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-indigo-500" />
                    <span className="text-sm sm:text-base font-semibold">
                      Joined on {convertToRealDate(currentUser?.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-indigo-500" />
                    <span className="text-sm sm:text-base font-semibold">
                      {String(currentUser?.role).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Role Info */}
              <div className="flex justify-center mt-5">
                <p className="text-xs sm:text-sm text-gray-400 text-center">
                  If you are logged in with Google, your default role is Student. You can edit your profile to change it.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
                <Link
                  to="/edit-profile"
                  className="px-6 py-2 flex items-center space-x-2 rounded-lg text-white transition"
                  style={{
                    backgroundColor: darkMode ? "#374151" : "#4f46e5",
                  }}
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-6 py-2 flex items-center space-x-2 rounded-lg text-white transition"
                  style={{
                    backgroundColor: darkMode ? "#b91c1c" : "#ef4444",
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                  {
                    loading && <span className="loader"></span>
                  }
                </button>

                {currentUser?.role === "instructor" && (
                  <Link
                    to="/dashboard/instructor"
                    className="px-6 py-2 flex items-center space-x-2 rounded-lg text-white transition"
                    style={{
                      backgroundColor: darkMode ? "#2563eb" : "#3b82f6",
                    }}
                  >
                    <span>Instructor Dashboard</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
