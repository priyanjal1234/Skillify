import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EditProfile from "./pages/EditProfile";
import InstructorDashboard from "./pages/InstructorDashboard";
import CoursePreview from "./pages/CoursePreview";
import EditCourse from "./pages/EditCourse";
import CourseDisplay from "./pages/CourseDisplay";
import CourseDescription from "./pages/CourseDescription";
import ProtectedRoute from "./pages/ProtectedRoute";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register/:name" element={<Register />} />
        <Route path="/login/:name" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/dashboard/instructor" element={<InstructorDashboard />} />
        <Route path="/course-preview/:courseId" element={<CoursePreview />} />
        <Route path="/edit-course/:courseId" element={<EditCourse />} />
        <Route path="/course-display" element={<CourseDisplay />} />
        <Route
          path="/course/:courseId"
          element={
            <ProtectedRoute>
              <CourseDescription />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
