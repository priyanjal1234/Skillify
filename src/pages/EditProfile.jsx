import React, { useRef, useState } from "react";
import FormField from "../components/FormField";
import { Mail, User, Upload } from "lucide-react";
import useFormHandler from "../hooks/useFormHandler";
import userService from "../services/User";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SubmitBtn from "../components/SubmitBtn";

const EditProfile = () => {
  const { values, handleChange } = useFormHandler({
    name: "",
    email: "",
    role: "student",
  });

  let navigate = useNavigate();

  const [profilePicture, setprofilePicture] = useState(null);
  const [loading, setloading] = useState(false);

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
    <div className="w-full min-h-screen bg-[#101828] flex items-center justify-center overflow-hidden">
      <div className="max-w-md w-full p-6 bg-gray-800 text-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
        <form onSubmit={handleEditProfile} className="space-y-4">
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
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Role
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={values.role === "student"}
                  onChange={handleChange}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-gray-300">Student</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="instructor"
                  checked={values.role === "instructor"}
                  onChange={handleChange}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-gray-300">Instructor</span>
              </label>
            </div>
          </div>

          {/* Profile Picture Upload */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center space-x-3">
              <label className="flex items-center cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md shadow-md">
                <Upload className="mr-2" size={16} />
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
                <span className="text-gray-300 text-sm">
                  {profilePicture.name}
                </span>
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
