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

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register/:name" element={<Register />} />
        <Route path="/login/:name" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element = {<ForgotPassword />}/>
        <Route path="/reset-password/:token" element = {<ResetPassword />}/>
        <Route path="/edit-profile" element = {<EditProfile />}/>
      </Routes>
    </>
  );
};

export default App;
