import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  let { isLoggedin } = useSelector((state) => state.user);
  if (!isLoggedin) {
    return <Navigate to={"/login/student"} />;
  }
  return children;
};

export default ProtectedRoute;
