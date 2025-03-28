import React, { useContext, useRef, useState } from "react";
import FormField from "../components/FormField";
import { Mail, User, Upload } from "lucide-react";
import useFormHandler from "../hooks/useFormHandler";
import userService from "../services/User";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SubmitBtn from "../components/SubmitBtn";
import { ThemeDataContext } from "../context/ThemeContext";
import { useSelector } from "react-redux";

const EditProfile = () => {
  const { values, handleChange } = useFormHandler({
    name: "",
    email: "",
    role: "student",
  });

  let navigate = useNavigate();
  const { darkMode } = useContext(ThemeDataContext);

  const [profilePicture, setprofilePicture] = useState(null);
  const [loading, setloading] = useState(false);

  let { currentUser } = useSelector((state) => state.user);

  const imageRef = useRef(null);

  async function handleEditProfile(e) {
    e.preventDefault();
    setloading(true);
    let formdata = new FormData();

    formdata.append("name", values.name);
    formdata.append("email", values.email);
    formdata.append("role", values.role);
    formdata.append("profilePicture", profilePicture);

    try {
      await userService.updateLoggedinUser(formdata);
      setloading(false);
      toast.success("Profile Updated Successfully");
      navigate("/");
    } catch (error) {
      setloading(false);
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <div
      className={`w-full min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div
        className={`w-full max-w-lg p-6 rounded-lg shadow-md transition duration-300 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
        <form onSubmit={handleEditProfile} className="space-y-5">
          <FormField
            label="Name"
            icon={User}
            type="text"
            placeholder="eg. John Doe"
            name="name"
            value={values.name}
            handleChange={handleChange}
          />
          <FormField
            label="Email Address"
            icon={Mail}
            type="email"
            placeholder="you@example.com"
            name="email"
            value={values.email}
            handleChange={handleChange}
          />

          {/* Role Selection */}
          {currentUser?.googleId && (
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={values.role === "student"}
                    onChange={handleChange}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Student</span>
                </label>
                <label className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="instructor"
                    checked={values.role === "instructor"}
                    onChange={handleChange}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Instructor</span>
                </label>
              </div>
            </div>
          )}

          {/* Profile Picture Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Profile Picture
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
              <label className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md shadow-md cursor-pointer w-full sm:w-auto">
                <Upload className="w-5 h-5" />
                <span>Upload</span>
                <input
                  ref={imageRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setprofilePicture(e.target.files[0])}
                />
              </label>
              {profilePicture && (
                <span className="text-sm mt-2 sm:mt-0">{profilePicture.name}</span>
              )}
            </div>
          </div>

          <SubmitBtn btnText="Save Changes" loading={loading} />
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
