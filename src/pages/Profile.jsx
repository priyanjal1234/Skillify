import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Mail, MapPin, Calendar, User, LogOut, Edit } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import convertToRealDate from "../utils/createdAtConversion";
import userService from "../services/User";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setLoggedin } from "../redux/reducers/UserReducer";
import { ThemeDataContext } from "../context/ThemeContext";
import { getUserLocation } from "../utils/getUserLocation";
import { getAddressFromCoordinates } from "../utils/convertToRealLocation";

const Profile = () => {
  let { currentUser } = useSelector((state) => state.user);
  let { darkMode } = useContext(ThemeDataContext);
  const [location, setlocation] = useState('');

  useEffect(() => {
    async function fetchLocation() {
      try {
        let { latitude, longitude } = await getUserLocation();
        let {address} = await getAddressFromCoordinates(latitude, longitude);
        setlocation(address);
      } catch (error) {
        setlocation({ street: "Unknown", city: "Unknown", state: "Unknown" });
      }
    }

    fetchLocation();
  }, []);

  let dispatch = useDispatch();
  let navigate = useNavigate();

  async function handleLogout() {
    try {
      await userService.logoutAccount();
      toast.success("Logout Success");
      dispatch(setLoggedin(false));
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <div
      className={
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }
    >
      <Navbar />

      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div
            className={`rounded-2xl shadow-xl overflow-hidden ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            {/* Header/Cover Image */}
            <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>

            {/* Profile Content */}
            <div className="relative px-4 sm:px-6 lg:px-8 pb-8">
              {/* Avatar */}
              <div className="relative -mt-16 mb-8 flex justify-center">
                <div className="relative">
                  <img
                    src={
                      currentUser?.profilePicture
                        ? currentUser?.profilePicture
                        : `https://cdn-icons-png.flaticon.com/512/149/149071.png`
                    }
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-700"
                  />
                </div>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">{currentUser?.name}</h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-indigo-500" />
                    <span>{currentUser?.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-indigo-500" />
                    <span>
                      {location}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="mb-2">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-indigo-500" />
                      <span className="font-semibold">
                        Joined on {convertToRealDate(currentUser?.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-indigo-500" />
                      <span className="font-semibold">
                        {String(currentUser?.role).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  className="px-6 py-2 flex items-center space-x-2 rounded-lg transition-colors"
                  style={{
                    backgroundColor: darkMode ? "#374151" : "#4f46e5",
                    color: darkMode ? "#ffffff" : "#ffffff",
                  }}
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>

                <button
                  onClick={handleLogout}
                  type="button"
                  className="px-6 py-2 flex items-center space-x-2 rounded-lg transition-colors"
                  style={{
                    backgroundColor: darkMode ? "#b91c1c" : "#ef4444",
                    color: darkMode ? "#ffffff" : "#ffffff",
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
